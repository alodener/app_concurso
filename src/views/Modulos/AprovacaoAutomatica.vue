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
      <CCardBody class="m-auto"><h4>Geranciador de Pagamentos</h4></CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm
                class="row mt-5 d-flex justify-content-between align-items-center"
              >
                <div class="col-auto mb-3">
                  <p>Selecione a(s) bancas</p>
                  <v-select
                    :disabled="readOnly"
                    v-model="partnerSelected"
                    :items="partners"
                    item-title="name"
                    item-value="id"
                    chips
                    multiple
                  ></v-select>
                </div>
                <div class="col-auto mb-3">
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
                <div class="col-auto d-flex align-items-center">
                  <CButton
                    type="submit"
                    @click="listPartnersMinValue()"
                    color="success"
                    class="same-height-button"
                  >
                    Consultar
                  </CButton>
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody v-if="tableVisible">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">Banca</th>
                  <th scope="col" width="20%">Pagamento Total</th>
                  <th scope="col" width="20%">Média/dia</th>
                  <th scope="col" width="30%">Valor Máximo</th>
                  <th scope="col" width="20%"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in partnersAutoaprovation" v-bind:key="item.id">
                  <td>{{ item.name }}</td>
                  <td>R$ {{ item.pagamento_total }}</td>
                  <td>R$ {{ item.media }}</td>
                  <td>
                    <CFormInput
                      :value="item.min_value_autoaprovation"
                      type="text"
                      :id="'banca_' + item.id"
                      @change="salvarValorMinimo(item.id)"
                    />
                  </td>
                  <td>
                    <CButton
                      type="submit"
                      @click="salvarValorMinimo(item.id)"
                      color="success"
                      class="same-height-button text-white"
                    >
                      Salvar
                    </CButton>
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
      partners: [],
      partnerSelected: [],
      partnerSelectedId: [],
      partnerSelectedName: null,
      number: '',
      premio: '',
      tableVisible: false,
      loading: false,
      totalPix: '',
      date: '',
    }
  },
  mounted() {
    this.listPartners()
  },
  methods: {
    gerarPDF() {
      /* eslint-disable */
      const requestData = {
        date: this.date,
        partners: this.partnersAutoaprovation
      };

      // Enviar a solicitação para a rota Laravel
      api.post('/partners/auto-aprovation/pdf', requestData, { responseType: 'blob' }) // Definir o responseType como 'blob' para receber uma resposta binária
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
    listPartners() {
      /* eslint-disable */
      this.loading = true;

      api
        .get(`/partners`)
        .then((response) => {
          this.partners = response.data;
          this.loading = false;
        })
        .catch(() => {})
    },
    listPartnersMinValue() {
      /* eslint-disable */
      this.loading = true;
      api
        .get(`/partners/auto-aprovation?ids=${this.partnerSelected}&date=${this.date}`)
        .then((response) => {
            const data = response.data;
            this.partnersAutoaprovation = data;

            this.tableVisible = true;
        })
        .catch(() => {})
        .finally(() => {
            this.loading = false;
        });
    },
    salvarValorMinimo(id) {
      this.loading = true;
      var valorNovo = document.getElementById('banca_' + id).value;

      api
        .post(`/partners/auto-aprovation/save/` + id, {
          valor: valorNovo,
        })
        .then((response) => {
          this.resetTable();
          this.listPartnersMinValue();
        })
        .catch(() => {})
        .finally(() => {
          // this.loading = false;
        });
    },
    resetTable() {
      this.tableVisible = false;
      this.partnersAutoaprovation = [];
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
