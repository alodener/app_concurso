<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
  <div>
    <CCard class="mb-5">
      <CCardBody class="m-auto"><h4>Log de Bilhetes</h4></CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm class="row mt-2">
                <div class="col-auto">
                  <CFormSelect
                    v-model="banca"
                    aria-label="Default select example"
                  >
                    <option value="">Selecione uma Banca</option>
                    <option
                      v-for="item in partners"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </CFormSelect>
                </div>
                <div class="col-auto">
                  <CFormSelect
                    v-model="modalidade"
                    aria-label="Default select example"
                  >
                    <option value="">Selecione uma modalidade</option>
                    <option value="1">LTB - Lotinha</option>
                    <option value="2">LTB - Super 5</option>
                    <option value="3">LTB - Super 6</option>
                    <option value="4">LTB - Mania De Jogo</option>
                    <option value="5">LTB - Dia De Alegria</option>
                    <option value="6">LTB - Mania De Time</option>
                    <option value="7">LTB - Duplo 6</option>
                    <option value="8">LTB - O Milionário</option>
                    <option value="9">LTB - CHISPALOTO</option>
                    <option value="10">LTB - MEGA KINO</option>
                    <option value="11">SANTA LÚCIA DOUBLE</option>
                    <option value="12">SUPER QUINA</option>
                  </CFormSelect>
                </div>
                <div class="col-auto custom-width">
                  <CFormInput
                    type="text"
                    id="premio"
                    placeholder="ID Bilhete"
                    v-model="bilhete_id"
                  />
                </div>
                <div class="col-auto">
                  <CFormInput
                    :disabled="readOnly"
                    type="date"
                    v-model="inicio"
                    aria-label="First name"
                  />
                </div>
                <div class="col-auto">
                  <CFormInput
                    :disabled="readOnly"
                    v-model="fim"
                    type="date"
                    aria-label="First name"
                  />
                </div>
                <div class="col-auto d-flex align-items-center">
                  <CButton
                    type="button"
                    style="color: #fff"
                    @click="consulta()"
                    color="success"
                    class="mb-3 mr-2"
                    >Consultar</CButton
                  >
                  <CButton
                    v-if="tableVisible"
                    style="color: #fff"
                    @click="generatePDF()"
                    class="mb-3 mr-2"
                    color="primary"
                  >
                    Gerar PDF
                  </CButton>
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody class="additional-info-card">
            <CRow class="mb-3">
              <CCol>
                <CCard disabled>
                  <CCardBody
                    v-if="tableVisible"
                    class="d-flex justify-content-between"
                  >
                    <div>Total de bilhetes: {{ totalBilhetes }}</div>
                    <div>Valor Total: {{ valorTotal }}</div>
                    <div>Total de Usuários: {{ totalUsuarios }}</div>
                    <!-- <div>Total Pag. Bonus: {{ totalPagBonus }}</div>
                    <div>Total Valor Liquido: {{ totalValorLiquido }}</div> -->
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardBody v-if="tableVisible">
            <!-- <div class="mb-3">
              <strong>Total de bilhetes:</strong> {{ totalBilhetes }}
            </div>
            <div class="mb-3">
              <strong>Valor Total:</strong> R$ {{ valorTotal }}
            </div>
            <div class="mb-3">
              <strong>Total de usuários:</strong> {{ totalUsuarios }}
            </div>
            <div class="mb-3">
              <strong>Concursos:</strong> {{ data.concursos }}
            </div> -->

            <!-- <div class="mb-3" v-if="data.info.length > 0">

            </div> -->

            <table class="table w-100" id="pdf-table">
              <thead>
                <tr>
                  <th scope="col" width="10%">ID Bilhete</th>
                  <th scope="col" width="15%">Usuário</th>
                  <th scope="col" width="20%">Números Apostados</th>
                  <th scope="col" width="15%">Valor Aposta</th>
                  <th scope="col" width="15%">Valor Prêmio</th>
                  <th scope="col" width="10%">Número</th>
                  <th scope="col" width="25%">Tipo de Jogo</th>
                  <th scope="col" width="30%">Data Sorteio</th>
                  <th scope="col" width="30%">Data Aposta</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedData" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.numbers }}</td>
                  <td>R$ {{ item.valor_aposta }}</td>
                  <td>R$ {{ item.valor_premio }}</td>
                  <td>{{ item.number }}</td>
                  <td>{{ item.tipo_jogo }}</td>
                  <td>{{ item.data_sorteio }}</td>
                  <td>{{ item.data_aposta }}</td>
                </tr>
              </tbody>
            </table>

            <div class="pagination">
              <button
                @click="changePage(page - 1)"
                :disabled="page <= 1"
                class="btn btn-primary"
              >
                Anterior
              </button>
              <span>Página {{ page }} de {{ totalPages }}</span>
              <button
                @click="changePage(page + 1)"
                :disabled="page >= totalPages"
                class="btn btn-primary"
              >
                Próxima
              </button>
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
import 'jspdf-autotable'
export default {
  name: 'ApostasFeitas',
  data() {
    return {
      partners: [],
      modalidade: '',
      bilhete_id: '',
      banca: '',
      data: [],
      tableVisible: false,
      readOnly: false,
      totalBilhetes: 0,
      valorTotal: 0,
      totalUsuarios: 0,
      inicio: null,
      loading: false,
      fim: null,
      page: 1,
      perPage: 10,
    }
  },
  mounted() {
    this.listPartners()
  },
  computed: {
    totalPages() {
      return Math.ceil(this.data.length / this.perPage)
    },
    paginatedData() {
      const start = (this.page - 1) * this.perPage
      const end = start + this.perPage
      return this.data.slice(start, end)
    },
  },
  methods: {
    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage
      }
    },
    listPartners() {
      this.loading = true

      api
        .get(`/partners`)
        .then((response) => {
          this.partners = response.data
          this.loading = false
        })
        .catch(() => {})
    },
    generatePDF() {
      const doc = new jsPDF()
      doc.text('Total de bilhetes: ' + this.totalBilhetes, 3, 15)
      doc.text('Total de usuários: ' + this.totalUsuarios, 3, 25)
      doc.text('Valor total: R$ ' + this.valorTotal, 3, 35)
      doc.autoTable({ html: '#pdf-table', startY: 45 })
      doc.save('dados.pdf')
    },
    consulta() {
      if (this.banca == '') {
        alert('Por favor selecione uma banca')
        return
      } else if (this.modalidade == '') {
        alert('Por favor selecione uma modalide')
        return
      } else if (!this.inicio) {
        alert('Por favor selecione uma data de início')
        return
      } else if (!this.fim) {
        alert('Por favor selecione uma data de fim')
        return
      }
      const dataInicio = new Date(this.inicio)
      const dataFim = new Date(this.fim)
      const diffMs = dataFim - dataInicio
      const diffDays = diffMs / (1000 * 60 * 60 * 24)
      if (diffDays > 30) {
        alert('O intervalo entre as datas não pode exceder 30 dias')
        return
      }

      this.loading = true

      const params = {
        banca: this.banca,
        modalidade: this.modalidade,
        inicio: this.inicio,
        fim: this.fim,
        bilhete_id: this.bilhete_id,
      }
      api
        .post(`/apostas-feitas/show`, params)
        .then((response) => {
          if (response.status == 200 && response.data.success) {
            this.changePage(1)
            this.data = response.data.data
            this.valorTotal = response.data.analytics.total_premios
            this.totalUsuarios = response.data.analytics.total_usuarios
            this.totalBilhetes = response.data.analytics.total_bilhetes
            this.tableVisible = true
            this.loading = false
          }
        })
        .catch(() => {})
    },
  },
}
</script>

<style scoped>
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
.custom-width {
  width: 150px;
}
.pagination {
  margin-top: 10px;
  text-align: center;
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
  0% {
    transform: rotate(0deg);
  } /* Rotação inicial */
  100% {
    transform: rotate(360deg);
  } /* Rotação completa */
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.pagination button {
  margin: 0 5px;
}
</style>
