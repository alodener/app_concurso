<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

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
                      'text-success':
                        !item.valor_liquido.includes('-') &&
                        item.valor_liquido !== 'R$ 0,00',

                      'text-danger':
                        item.valor_liquido.includes('-') &&
                        item.valor_liquido !== 'R$ 0,00',
                      'text-black': item.valor_liquido === 'R$ 0,00',
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
                @click="gerarPDF"
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

export default {
  name: 'AprovarPremio',
  data() {
    return {
      number: '',
      premio: '',
      tableVisible: false,
      loading: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,
      totalValorLiquido: '',
      totalPagBonus: '',
      totalPagPremios: '',
      totalRecargaManual: '',
      totalPix: '',
      ganhadores: '',
      date: '',
      winners: [],
    }
  },
  methods: {
    openModalGanhadores() {
      this.modalGanhadores = true
    },
    gerarPDF() {
      /* eslint-disable */
      const requestData = {
        totalValorLiquido: this.totalValorLiquido,
        totalPagBonus: this.totalPagBonus,
        totalPagPremios: this.totalPagPremios,
        totalRecargaManual: this.totalRecargaManual,
        totalPix: this.totalPix,
        ganhadores: this.ganhadores,
        date: this.date,
        winners: this.winners
      };

      // Enviar a solicitação para a rota Laravel
      api.post('/partners/pdf', requestData, { responseType: 'blob' }) // Definir o responseType como 'blob' para receber uma resposta binária
          .then(response => {
            // Criar um URL temporário para o blob
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            // Abrir o PDF no navegador
            window.open(url, '_blank');
            // Limpar o URL temporário após 10 minutos
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
            }, 10 * 60 * 1000); // 10 minutos em milissegundos
          })
          .catch(error => {
            // Lidar com erros
      });
    },
    listWinners() {
      /* eslint-disable */
      this.loading = true;
      api
        .get(`/partners/financeiro?number=${this.date}`)
        .then((response) => {
            const lastItem = response.data[response.data.length - 1];
            this.winners = response.data
            
            // Armazenar os valores em variáveis
            this.totalPix = lastItem.totalPix;
            this.totalRecargaManual = lastItem.totalRecargaManual;
            this.totalPagPremios = lastItem.totalPagPremios;
            this.totalPagBonus = lastItem.totalPagBonus;
            this.totalValorLiquido = lastItem.totalValorLiquido;

            // Tornar a tabela visível
            this.tableVisible = true;
        })
        .catch(() => {})
        .finally(() => {
            this.loading = false;
        });
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
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Transparência para criar o efeito de fade */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Z-index alto para ficar na frente de outros elementos */
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3); /* Cor e espessura da borda do spinner */
  border-radius: 50%; /* Forma do spinner */
  border-top: 4px solid #ffffff; /* Cor e espessura da borda superior do spinner */
  width: 50px; /* Largura do spinner */
  height: 50px; /* Altura do spinner */
  animation: spin 1s linear infinite; /* Animação de rotação */
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); } /* Rotação inicial */
  100% { transform: rotate(360deg); } /* Rotação completa */
}

</style>
