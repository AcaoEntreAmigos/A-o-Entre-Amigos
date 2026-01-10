// ===============================
// VARIÁVEIS GLOBAIS
// ===============================
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let usuarioAtual = null;
let nomesCadastrados = [];
let listasGeradas = [];
let convitesEnviados = [];

// ===============================
// CRIA USUÁRIO ADM INICIAL
// ===============================
if (usuarios.length === 0) {
  usuarios.push({
    codigo: "AEA-0001",
    senha: "1234",
    nome: "ADM Sistema",
    nomesCadastrados: [],
    historico: [],
    convites: []
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// ===============================
// FLUXO DOM PRONTO
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const u = localStorage.getItem("usuarioAtual");
  if (u) {
    usuarioAtual = JSON.parse(u);
    nomesCadastrados = usuarioAtual.nomesCadastrados || [];
    listasGeradas = usuarioAtual.historico || [];
    convitesEnviados = usuarioAtual.convites || [];
  }

  if (document.getElementById("dashNome") && usuarioAtual) {
    document.getElementById("dashNome").textContent = usuarioAtual.nome;
    document.getElementById("dashCodigo").textContent = usuarioAtual.codigo;
    document.getElementById("dashTotalListas").textContent = listasGeradas.length;
    atualizarListaInicial();
  }
});

// ===============================
// FUNÇÕES GERAIS
// ===============================
function mostrarTela(id) {
  ["telaRegras","telaLogin","telaDashboard","telaConvite","telaCadastro"].forEach(t => {
    const el = document.getElementById(t);
    if (el) el.style.display = "none";
  });
  const alvo = document.getElementById(id);
  if (alvo) alvo.style.display = "block";
}

function aceitarRegras(){
  const checkbox = document.getElementById("aceitoRegrasCheckbox");
  if(!checkbox || !checkbox.checked){
    alert("Você precisa aceitar as regras para continuar.");
    return;
  }
  localStorage.setItem("aceitouRegras","sim");
  mostrarTela("telaLogin");
}

function sair(){
  localStorage.removeItem("usuarioAtual");
  document.body.innerHTML="";
}

function resetarSistema(){
  if(confirm("Deseja resetar totalmente o sistema?")){
    localStorage.clear();
    window.location.href="index.html";
  }
}

// ===============================
// LOGIN
// ===============================
function login(){
  const codigo = document.getElementById("codigoLogin")?.value.trim();
  const senha = document.getElementById("senhaLogin")?.value.trim();
  const u = usuarios.find(x=>x.codigo===codigo && x.senha===senha);
  if(!u){
    alert("Código ou senha inválidos");
    return;
  }

  usuarioAtual = u;
  nomesCadastrados = usuarioAtual.nomesCadastrados || [];
  listasGeradas = usuarioAtual.historico || [];
  convitesEnviados = usuarioAtual.convites || [];
  localStorage.setItem("usuarioAtual",JSON.stringify(usuarioAtual));
  window.location.href="dashboard.html";
}

// ===============================
// DASHBOARD
// ===============================
function atualizarListaInicial(){
  const ul=document.getElementById("dashListaAtiva");
  if(ul){
    ul.innerHTML="";
    nomesCadastrados.forEach(n=>{
      const li=document.createElement("li");
      const pixInfo = n.pix
        ? ` - PIX (${n.tipoPix}): ${n.pix}`
        : " - PIX: não informado";
      li.textContent = `${n.data} - ${n.codigo} - ${n.nome}${pixInfo}`;
      ul.appendChild(li);
    });
  }
}

// ===============================
// LISTAS
// ===============================
function mostrarListas(){
  if(!nomesCadastrados.length){
    alert("Ainda não há participantes cadastrados.");
    return;
  }
  let texto="";
  const totalListas=Math.ceil(nomesCadastrados.length/5);
  for(let i=0;i<totalListas;i++){
    const listaAtual=nomesCadastrados.slice(i*5,i*5+5);
    texto+=`Lista ${i+1}:\n`;
    listaAtual.forEach((p,j)=>{
      const pos=i*5+j+1;
      const pixTxt=p.pix?` - PIX (${p.tipoPix}): ${p.pix}`:" - PIX: não informado";
      texto+=`${pos}º - ${p.codigo} - ${p.nome} - ${p.data}${pixTxt}\n`;
    });
    texto+="\n";
  }
  alert(texto);
}

// ===============================
// CADASTRO PARTICIPANTE
// ===============================
function cadastrarParticipante(){
  const nome=document.getElementById("nome")?.value.trim();
  const telefone=document.getElementById("telefoneWhatsapp")?.value.replace(/\D/g,"");
  const tipoPix=document.getElementById("tipoPix")?.value||"";
  const pix=document.getElementById("pix")?.value.trim()||"";

  if(!nome) return alert("Informe o nome.");
  if(!telefone||telefone.length<10) return alert("Informe um telefone válido.");

  // VALIDAÇÃO PIX
  if(!tipoPix||!pix) return alert("Informe o tipo de chave PIX e a chave.");

  if(tipoPix==="Telefone"&&!validarTelefonePix(pix.replace(/\D/g,""))) return alert("PIX telefone inválido.");
  if(tipoPix==="Email"&&!validarEmailPix(pix)) return alert("PIX email inválido.");
  if(tipoPix==="CPF"&&!validarCpfPix(pix)) return alert("PIX CPF inválido.");
  if(tipoPix==="Chave Aleatória"&&!validarChaveAleatoriaPix(pix)) return alert("PIX chave aleatória inválida.");

  let novoCodigo;
  do{
    novoCodigo="AEA"+Math.floor(100000+Math.random()*900000);
  }while(usuarios.some(u=>u.codigo===novoCodigo));

  const senha=telefone.slice(-4);
  const dataAtual=new Date().toLocaleDateString();

  usuarios.push({codigo:novoCodigo,senha,nome,telefone,nomesCadastrados:[],historico:[],convites:[]});

  nomesCadastrados.push({data:dataAtual,codigo:novoCodigo,nome,tipoPix,pix});
  usuarioAtual.nomesCadastrados=nomesCadastrados;

  salvarUsuario();
  atualizarListaInicial();

  alert(`Participante cadastrado!\nCódigo: ${novoCodigo}\nSenha: ${senha}`);

  document.getElementById("nome").value="";
  document.getElementById("telefoneWhatsapp").value="";
  document.getElementById("pix").value="";
}

// ===============================
// VALIDAÇÕES PIX
// ===============================
function validarTelefonePix(tel){ return /^[1-9]{2}9?\d{8}$/.test(tel); }
function validarEmailPix(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validarCpfPix(cpf){
  cpf=cpf.replace(/\D/g,"");
  if(cpf.length!==11||/^(\d)\1+$/.test(cpf)) return false;
  let soma=0;
  for(let i=0;i<9;i++) soma+=cpf[i]*(10-i);
  let resto=(soma*10)%11;
  if(resto===10) resto=0;
  if(resto!=cpf[9]) return false;
  soma=0;
  for(let i=0;i<10;i++) soma+=cpf[i]*(11-i);
  resto=(soma*10)%11;
  if(resto===10) resto=0;
  return resto==cpf[10];
}
function validarChaveAleatoriaPix(chave){ return /^[a-zA-Z0-9]{32}$/.test(chave); }

// ===============================
// UTIL
// ===============================
function salvarUsuario(){
  const i=usuarios.findIndex(u=>u.codigo===usuarioAtual.codigo);
  if(i>=0) usuarios[i]=usuarioAtual;
  localStorage.setItem("usuarios",JSON.stringify(usuarios));
  localStorage.setItem("usuarioAtual",JSON.stringify(usuarioAtual));
}

// ===============================
// NAVEGAÇÃO (RESTAURADA)
// ===============================
function irParaConvite(){ window.location.href="modulo_convite.html"; }
function irParaCadastroConvidado(){ window.location.href="cadastro_convidado.html"; }
