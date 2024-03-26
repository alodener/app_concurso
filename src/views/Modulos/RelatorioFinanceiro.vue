<template>
  <CModal :visible="modalVisible">
    <CModalHeader>
      <CModalTitle>Deseja Realmente alterar o status?</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton :disabled="modalDisabled" color="success" @click="updateStatus()"
        >Confirmar</CButton
      >
    </CModalFooter>
  </CModal>

  <CModal :visible="modalGanhadores">
    <CModalHeader>
      <CModalTitle>Adicionar Valor e Ganhadores</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton :disabled="modalDisabled" color="success" @click="confirmAction">
        Confirmar
      </CButton>
      <CButton :disabled="modalDisabled" color="secondary" @click="closeModal">
        Cancelar
      </CButton>
    </CModalFooter>
  </CModal>
  <div class="relatorio-content">
    <CCard class="mb-5">
      <CCardBody class="m-auto"><h4>Relatório Financeiro</h4></CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm class="row mt-5">
                <div class="col-auto"></div>
                <div class="col-auto">
                  <CFormLabel for="inputPassword2" class="visually-hidden"
                    >Password</CFormLabel
                  >
                  <CFormInput
                    :disabled="readOnly"
                    v-model="date"
                    type="date"
                    aria-label="First name"
                  />
                </div>
                <div class="col-auto">
                  <CButton
                    type="submit"
                    @click="listWinners()"
                    color="success"
                    class="mb-3"
                    >Consultar</CButton
                  >
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody class="additional-info-card">
            <CRow class="mb-3">
              <CCol>
                <CCard disabled>
                  <CCardBody class="d-flex justify-content-between">
                    <div>Total Pix: {{ totalPix }}</div>
                    <div>Total Recarga Manual: {{ totalRecargaManual }}</div>
                    <div>Total Pag Prêmios: {{ totalPagPremios }}</div>
                    <div>Total Pag. Bonus: {{ totalPagBonus }}</div>
                    <div>Total Valor Liquido: {{ totalValorLiquido }}</div>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardBody v-if="tableVisible">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">Banca</th>
                  <th scope="col" width="20%">Depósito Pix</th>
                  <th scope="col" width="20%">Recarga Manual</th>
                  <th scope="col" width="20%">Pagamento Prêmios</th>
                  <th scope="col" width="20%">Pagamento de Bonús</th>
                  <th scope="col" width="20%">Valor Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <td>{{ item.banca }}</td>
                  <td>{{ item.dep_pix }}</td>
                  <td>{{ item.recarga_manual }}</td>
                  <td>{{ item.pag_premios }}</td>
                  <td>{{ item.pag_bonus }}</td>
                  <td
                    v-bind:class="{
                      'text-success': !item.valor_liquido.includes('-'),
                      'text-danger': item.valor_liquido.includes('-'),
                    }"
                  >
                    {{ item.valor_liquido }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="button-container fixed-buttons">
              <CButton
                v-show="tableVisible"
                class="copy-button btn btn-primary btn-lg"
                color="primary"
                @click="generatePDF"
                id="botaoCopiarListaGanhadores"
              >
                Gerar PDF
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import api from '@/plugins/axios'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'AprovarPremio',
  data() {
    return {
      number: '',
      premio: '',
      date: '',
      winners: [],
      tableVisible: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,

      ganhadores: '',
    }
  },
  methods: {
    openModalGanhadores() {
      this.modalGanhadores = true
    },
    listWinners0() {
      api
        .get(`/partners/financeiro?number=${this.date}`)
        .then((response) => {
          this.winners = response.data
          this.tableVisible = true
        })
        .catch(() => {})
    },
    generatePDF() {
      /* eslint-disable */

      // Seletor do conteúdo da página
      const contentSelector = '.relatorio-content'; // Usando uma classe

      // Opções para o PDF
      const pdfOptions = {
        filename: 'relatorio_financeiro.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 5 },
        jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait' }
      };

      // Obtém o conteúdo da página como elementos HTML
      const content = document.querySelectorAll(contentSelector);

      // Cria um novo documento PDF
      const pdf = new jsPDF(pdfOptions.jsPDF);

      // Itera sobre os elementos do conteúdo e adiciona-os ao PDF
      content.forEach(element => {
        html2canvas(element, {
          scale: pdfOptions.html2canvas.scale,
          useCORS: true
        }).then(canvas => {
          const imageData = canvas.toDataURL('image/' + pdfOptions.image.type);
          pdf.addImage(imageData, 'JPEG', 0, 0);
          pdf.addPage();
        });
      });

      // Salva o PDF
      pdf.save(pdfOptions.filename);
    },
    listWinners() {
      /* eslint-disable */
      api
        .get(`/partners/financeiro?number=${this.date}`)
        .then((response) => {
            const lastItem = response.data[response.data.length - 1];
            this.winners = response.data
            
            // Armazenar os valores em variáveis
            const totalPix = lastItem.totalPix;
            const totalRecargaManual = lastItem.totalRecargaManual;
            const totalPagPremios = lastItem.totalPagPremios;
            const totalPagBonus = lastItem.totalPagBonus;
            const totalValorLiquido = lastItem.totalValorLiquido;

            this.totalPix = totalPix;
            this.totalRecargaManual = totalRecargaManual;
            this.totalPagPremios = totalPagPremios;
            this.totalPagBonus = totalPagBonus;
            this.totalValorLiquido = totalValorLiquido;

            // Tornar a tabela visível
            this.tableVisible = true;
        })
        .catch(() => {});
    },
    openModal(id, status) {
      this.modalVisible = true
      this.body = {
        partner: this.partnerSelected,
        id,
        status,
      }
    },
  },
}
</script>

<style>
.header_align {
  display: flex;
  justify-content: space-between;
}
.text_button {
  font-size: 14px;
}
.align_bottom {
  margin-right: 10px;
}
.alinhar_paginacao {
  justify-content: space-between;
}
.pagination_align {
  max-width: 60px;
  margin-left: 8px;
}
.copy-button {
  bottom: 20px;
  right: 20px;
}
.send-button {
  bottom: 20px;
  right: 40px;
}
.button-container {
  display: flex;
  justify-content: space-between;
}
.fixed-buttons {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
