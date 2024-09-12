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
                    <option disabled selected>Selecione uma Banca</option>
                    <option
                      v-for="item in partners"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.name }}
                    </option>
                  </CFormSelect>
                </div>
                <!-- <div class="col-auto">
                  <CFormSelect
                    v-model="modalidade"
                    aria-label="Default select example"
                  >
                    <option disabled selected>Selecione uma modalidade</option>
                    <option value="1,2,3,4,5,6,7,8,9,10,11,12">
                      Todas Modalidades
                    </option>
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
                </div> -->
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
                    v-model="data_sorteio"
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
                    Gerar TXT
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
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardBody v-if="tableVisible">
            <div style="width: 100%; overflow: auto">
              <table class="table table-responsive" id="pdf-table">
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
            </div>

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
      data_sorteio: null,
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
      let txtContent = `Total de bilhetes: ${this.totalBilhetes}\n`
      txtContent += `Total de usuários: ${this.totalUsuarios}\n`
      txtContent += `Valor total: R$ ${this.valorTotal}\n\n`

      this.data.forEach(function (v) {
        txtContent += `------------------------\n`
        txtContent += `Banca: ${v.nome_banca}\n`
        txtContent += `ID Bilhete: ${v.id}\n`
        txtContent += `ID Concurso: ${v.number}\n`
        txtContent += `ID Cliente: ${v.client_id}\n`
        txtContent += `Nome Cliente: ${v.client_name}\n`
        txtContent += `Tipo Jogo: ${v.tipo_jogo}\n`
        txtContent += `Numeros Apostados: ${v.numbers}\n`
        txtContent += `Valor Aposta: ${v.valor_aposta}\n`
        txtContent += `Valor Prêmio: ${v.valor_premio}\n`
        txtContent += `Nome Usuário: ${v.name}\n`
        txtContent += `Email Usuário: ${v.email}\n`
        txtContent += `Avulso: ${v.random_game == 0 ? 'Não' : 'Sim'}\n`
        txtContent += `Data Sorteio: ${v.data_sorteio}\n`
        txtContent += `Data Criação: ${v.data_aposta}\n`
        txtContent += `------------------------\n`
      })

      const blob = new Blob([txtContent], { type: 'text/plaincharset=utf-8' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'dados.txt'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    },
    consulta() {
      if (this.banca == '') {
        alert('Por favor selecione uma banca')
        return
      } else if (!this.data_sorteio) {
        alert('Por favor selecione uma data de início')
        return
      }

      this.loading = true

      const params = {
        banca: this.banca,
        modalidade: this.modalidade,
        data_sorteio: this.data_sorteio,
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
