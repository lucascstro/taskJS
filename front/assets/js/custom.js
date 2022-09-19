var urlApi = "http://localhost:5500";

var oModeloIndex = {
  CriacomponenteAccordion: function (listaTarefas, elementoAccordion) {
    if (listaTarefas != undefined) {
      var index = 0;
      listaTarefas.forEach((element) => {
        //elemento do acordeon base para ciração dinâmica.
        document.getElementById(elementoAccordion).innerHTML +=
          `<div class="accordion-item">` +
          ` <h2 class="accordion-header" id="item ${index}">` +
          `   <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}"` +
          `     aria-expanded="false" aria-controls="collapse${index}">` +
          `     ${element.titulo}` +
          `   </button>` +
          ` </h2>` +
          ` <div id="collapse${index}" class="accordion-collapse collapse hide" aria-labelledby="item ${index}"` +
          `   data-bs-parent="#${elementoAccordion}">` +
          `  <div class="accordion-body">` +
          `    ${element.descricao}` +
          `  </div>` +
          `  <div class="d-grid gap-2 d-md-block" style="margin-left: 2%">` +
          `    <button class="btn btn-secondary" type="button" onclick= "oModeloIndex.AtualizarTarefa(${element.id})">Editar</button>` +
          `    <button class="btn btn-danger" type="button" onclick= "oModeloIndex.ExcluirTarefa(${element.id})">Excluir</button>` +
          `  </div>` +
          ` <br>` +
          ` </div>` +
          `</div>`;
        index++;
      });
    } else {
      document.getElementById(
        `${elementoAccordion}`
      ).innerHTML += `<div class="alert alert-danger" role="alert"> Não há tarefas cadastradas </div>`;
    }
  },
  GetTask: function () {
    //todas
    $.ajax({
      method: "GET",
      url: urlApi + "/tasks",
      cache: false,
      success: function (ret) {
        oModeloIndex.CriacomponenteAccordion(ret, "accodionComponenteTodas");
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });

    //Pendentes
    $.ajax({
      method: "GET",
      url: urlApi + "/tasks/pendentes",
      cache: false,
      success: function (ret) {
        oModeloIndex.CriacomponenteAccordion(
          ret,
          "accodionComponentePendentes"
        );
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });

    // emExecucao
    $.ajax({
      method: "GET",
      url: urlApi + "/tasks/emExecucao",
      cache: false,
      success: function (ret) {
        oModeloIndex.CriacomponenteAccordion(
          ret,
          "accodionComponenteemExecucao"
        );
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });

    // Finalizadas
    $.ajax({
      method: "GET",
      url: urlApi + "/tasks/finalizadas",
      cache: false,
      success: function (ret) {
        oModeloIndex.CriacomponenteAccordion(
          ret,
          "accodionComponenteExecutadas"
        );
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });

    // Atrasadas
    $.ajax({
      method: "GET",
      url: urlApi + "/tasks/emAtraso",
      cache: false,
      success: function (ret) {
        oModeloIndex.CriacomponenteAccordion(
          ret,
          "accodionComponenteAtrasadas"
        );
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });

    //Canceladas
    $.ajax({
      method: "GET",
      url: urlApi + "/tasks/canceladas",
      cache: false,
      success: function (ret) {
        oModeloIndex.CriacomponenteAccordion(
          ret,
          "accodionComponenteCanceladas"
        );
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });
  },
  CriarNovaTarefa: function () {
    $.ajax({
      method: "POST",
      url: urlApi + "/task",
      data: {
        titulo: $("#txtTituloTarefa").val(),
        descricao: $("#txtDescricaoTarefa").val(),
        status: "1",
        dataCadastro: new Date().toLocaleString(),
        dataFinalizada: "",
        dataMaximaExecutar: $("#txtDataMaxiMaTarefa").val(),
        dataUltimaAlteracao: new Date().toLocaleString(),
      },
      cache: false,
      success: function (ret) {
        console.log(ret);
        alert("Salvo com sucesso");
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });
  },
  BuscarTarefaPorId: function (id) {
    $.ajax({
      method: "GET",
      url: urlApi + `/task/${id}`,
      cache: false,
      success: function (ret) {
        return ret;
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });
  },
  AtualizarTarefa: function (id) {
    document.getElementById("modalEdicao").innerHTML = "";
    $.ajax({
      method: "GET",
      url: urlApi + `/task/${id}`,
      cache: false,
      success: function (ret) {
        document.getElementById("modalEdicao").innerHTML +=
          `<!-- Modal -->` +
          `<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" >` +
          `   <div class="modal-dialog">` +
          `     <div class="modal-content">` +
          `       <div class="modal-header">` +
          `         <h5 class="modal-title" id="exampleModalLabel">Editar tarefas</h5>` +
          `         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>` +
          `       </div>` +
          `       <div class="modal-body">` +
          `         <div class="card-body">` +
          `            <div class="mb-3">` +
          `                 <label class="form-label">Título</label>` +
          `                 <input type="text" class="form-control" id="txtTituloTarefa" value="${ret.titulo}">` +
          `            </div>` +
          `            <div class="mb-3">` +
          `                 <label class="form-label">Descrição</label>` +
          `                 <textarea class="form-control" type="text" id="txtDescricaoTarefa" rows="3">${ret.descricao}</textarea>` +
          `             </div>` +
          `             <div class="mb-3">` +
          `                 <label class="form-label">Concluir até dia</label>` +
          `                 <input type="date" class="form-control" id="txtDataMaxiMaTarefa" value="${ret.dataMaximaExecutar}">` +
          `             </div>` +
          `             <a class="btn btn-success" onclick="oModeloIndex.CriarNovaTarefa()">Salvar</a>` +
          `             <a class="btn btn-primary" href="index.html">Cancelar</a>` +
          `           </div>` +
          `       </div>` +
          `       <div class="modal-footer">` +
          `        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>` +
          `        <button type="button" class="btn btn-primary">Save changes</button>` +
          `      </div>` +
          `    </div>` +
          `  </div>` +
          `</div>`;

          var myModal = new bootstrap.Modal(document.getElementById("exampleModal"));
          myModal.show();
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });

   
  },
  ExcluirTarefa: function (id) {
    $.ajax({
      method: "DELETE",
      url: urlApi + `/task/${id}`,
      cache: false,
      success: function (ret) {
        if (ret == "OK") {
          alert("Tarefa Excluída");
          document.getElementById("accodionComponente").innerText = "";
          oModeloIndex.GetTask();
        }
      },
      error: function (erro) {
        alert("Algo de errado aconteceu!");
        console.log(erro);
      },
    });
  },
};
