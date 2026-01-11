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
  const dataAtual = new Date().toLocaleDateString();
  usuarios.push({
    codigo: "AEA-0001",
    senha: "1234",
    nome: "ADM Sistema",
    nomesCadastrados: [{ data: dataAtual, codigo: "AEA-0001", nome: "ADM Sistema" }],
    historico: [],
    convites: []
  });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

// ===============================
// FLUXO DOM PRONTO
// ===============================
document.addEventListener("DOMContentLoaded", function() {
  const aceitou = localStorage.getItem("aceitouRegras");
  const u = localStorage.getItem("usuarioAtual");

  if (!aceitou || aceitou !== "sim") {
    mostrarTela("telaRegras");
    return;
  }

  if (!u) {
    mostrarTela("telaLogin");
    return;
  }

  usuarioAtual = JSON.parse(u);
  nomesCadastrados = usuarioAtual.nomesCadastrados || [];
  listasGeradas = usuarioAtual.historico || [];
  convitesEnviados = usuarioAtual.convites || [];

  if (document.getElementById("dashNome")) {
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
    if(el) el.style.display = "none";
  });
  const alvo = document.getElementById(id);
  if(alvo) alvo.style.display = "block";
}

function formatarTelefone(campo){
  let v = campo.value.replace(/\D/g,"");
  if(v.length>11) v=v.slice(0,11);
  if(v.length>6) v=`(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
  else if(v.length>2) v=`(${v.slice(0,2)}) ${v.slice(2)}`;
  campo.value=v;
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
  const codigoInput = document.getElementById("codigoLogin");
  const senhaInput = document.getElementById("senhaLogin");
  if(!codigoInput || !senhaInput) return;

  const codigo = codigoInput.value.trim();
  const senha = senhaInput.value.trim();
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
    nomesCadastrados.forEach((n,i)=>{
      const li=document.createElement("li");
      const pixInfo = n.pix ? `PIX – ${n.tipoPix || "Telefone"}: ${n.pix}` : "";
      li.textContent=`${i+1}º ${n.codigo} ${n.nome} ${n.data} ${pixInfo}`;
      ul.appendChild(li);
    }); 
  }

  const totalUsuarios=document.getElementById("dashTotalUsuarios");
  if(totalUsuarios) totalUsuarios.textContent=nomesCadastrados.length;

  const totalListas=document.getElementById("dashTotalListas");
  if(totalListas) totalListas.textContent=listasGeradas.length;
}

// ===============================
// LISTAS E CONVITES
// ===============================
function mostrarListas() {
  if (!nomesCadastrados.length) {
    alert("Ainda não há participantes cadastrados.");
    return;
  }

  let texto = "";
  const total = nomesCadastrados.length;
  const totalListas = Math.ceil(total / 5);

  for(let i=0;i<totalListas;i++){
    const inicio = i*5;
    const fim = inicio+5;
    const listaAtual = nomesCadastrados.slice(inicio,fim);

    texto += `Lista ${i+1}${listaAtual.length<5?" (incompleta)":""}:\n`;

    listaAtual.forEach((p,j)=>{
      const pos = inicio+j+1;
      const pixInfo = p.pix ? `PIX – ${p.tipoPix || "Telefone"}: ${p.pix}` : "";
      texto += `${pos}º ${p.codigo} ${p.nome} ${p.data} ${pixInfo}\n`;
    });
    texto += "\n";
  }
  alert(texto);
}

function verMeusConvites() {
  if (!convitesEnviados.length) {
    alert("Você ainda não enviou nenhum convite.");
    return;
  }
  let texto = "";
  convitesEnviados.forEach((c,i)=>{
    texto += `${i+1}º - ${c.data} - ${c.nome} (${c.telefone})`;
    if(c.listaEnviada) texto += ` | Lista enviada em ${c.listaEnviada}`;
    texto += "\n";
  });
  alert(texto);
}

function enviarConvite() {
  const nome = document.getElementById("nomeConvidado")?.value.trim();
  const tel = document.getElementById("telefoneConvidado")?.value.replace(/\D/g,"");
  if(!nome || !tel){
    alert("Preencha nome e telefone.");
    return;
  }
  if(convitesEnviados.find(c=>c.telefone===tel)){
    alert("Este contato já recebeu convite.");
    return;
  }

  const convite = { nome, telefone: tel, data: new Date().toLocaleDateString() };
  convitesEnviados.push(convite);
  usuarioAtual.convites = convitesEnviados;
  salvarUsuario();

  const msg = `Olá ${nome}, você foi convidado por ${usuarioAtual.nome} para participar da Ação Entre Amigos.`;
  window.open(`https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`, "_blank");
  alert("Convite enviado com sucesso!");
}

function enviarLista(){
  if(!listasGeradas.length || !convitesEnviados.length){
    alert("Não há listas ou convites.");
    return;
  }

  const lista = listasGeradas[listasGeradas.length-1];
  let menu="";
  convitesEnviados.forEach((c,i)=>{
    menu += `${i+1} - ${c.nome} (${c.telefone})\n`;
  });

  const escolha = prompt(menu);
  const idx = parseInt(escolha)-1;
  if(!convitesEnviados[idx]) return;

  const c = convitesEnviados[idx];
  const msg = `Olá ${c.nome}, segue a lista:\n\n${
    lista.map((nome,i)=>`${i+1}º - ${nome}`).join("\n")
  }`;

  window.open(`https://wa.me/55${c.telefone}?text=${encodeURIComponent(msg)}`, "_blank");

  c.listaEnviada = new Date().toLocaleDateString();
  salvarUsuario();
}

// ===============================
// CADASTRO PARTICIPANTE
// ===============================
function cadastrarParticipante() {
  const nome = document.getElementById("nome")?.value.trim();
  const telefone = document.getElementById("telefoneWhatsapp")?.value.replace(/\D/g,"");
  const pix = document.getElementById("pix")?.value.trim();
  const tipoPix = document.getElementById("tipoPix")?.value;

  if (!nome) return alert("Informe o nome.");
  if (!telefone || telefone.length < 10) return alert("Informe um telefone válido.");
  if (!pix) return alert("Informe a chave PIX.");
  if (!validarPix(pix)) return alert("Chave PIX inválida.");

  // ===============================
  // GERAR CÓDIGO E SENHA
  // ===============================
  let novoCodigo;
  do {
    const numeros = Array.from({length:6}, () => Math.floor(Math.random()*10)).join("");
    novoCodigo = "AEA" + numeros;
  } while (usuarios.some(u => u.codigo === novoCodigo));

  const senha = telefone.slice(-4);
  const dataAtual = new Date().toLocaleDateString();

  // ===============================
  // CRIA NOVO USUÁRIO
  // ===============================
  const novoUsuario = {
    codigo: novoCodigo,
    senha,
    nome,
    telefone,
    pix,
    tipoPix,
    nomesCadastrados: [{ data: dataAtual, codigo: novoCodigo, nome }],
    historico: [],
    convites: []
  };

  usuarios.push(novoUsuario);

  nomesCadastrados.push({
    data: dataAtual,
    codigo: novoCodigo,
    nome,
    pix,
    tipoPix
  });

  if (nomesCadastrados.length % 5 === 0) {
    listasGeradas.push(nomesCadastrados.slice(-5).map(n => n.nome));
  }

  usuarioAtual.nomesCadastrados = nomesCadastrados;
  usuarioAtual.historico = listasGeradas;

  salvarUsuario();
  atualizarListaInicial();

  alert(`Participante cadastrado!\nCódigo: ${novoCodigo}\nSenha: ${senha}`);

  document.getElementById("nome").value = "";
  document.getElementById("telefoneWhatsapp").value = "";
  document.getElementById("pix").value = "";
  document.getElementById("tipoPix").value = "";
}

// ===============================
// VALIDAÇÃO PIX (ISOLADA)
// ===============================
function validarPix(valor) {
  valor = valor.trim();
  return validarTelefonePix(valor)
      || validarCpfPix(valor)
      || validarEmailPix(valor)
      || validarChaveAleatoriaPix(valor);
}

function validarTelefonePix(v) {
  const tel = v.replace(/\D/g,"");
  return tel.length === 10 || tel.length === 11;
}

function validarCpfPix(cpf) {
  cpf = cpf.replace(/\D/g,"");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto === parseInt(cpf[10]);
}

function validarEmailPix(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarChaveAleatoriaPix(chave) {
  return /^[a-zA-Z0-9]{32}$/.test(chave);
}

// ===============================
// UTILIDADES
// ===============================
function salvarUsuario(){
  if(!usuarioAtual) return;
  const i=usuarios.findIndex(u=>u.codigo===usuarioAtual.codigo);
  if(i>=0) usuarios[i]=usuarioAtual;
  localStorage.setItem("usuarios",JSON.stringify(usuarios));
  localStorage.setItem("usuarioAtual",JSON.stringify(usuarioAtual));
}

// ===============================
// NAVEGAÇÃO
// ===============================
function irParaConvite(){ window.location.href="modulo_convite.html"; }
function irParaCadastroConvidado(){ window.location.href="cadastro_convidado.html"; }
