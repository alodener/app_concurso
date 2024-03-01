<template>
  <div>
    <CCard class="mb-5">
      <CCardBody class="m-auto"><h4>Apostas Feitas</h4></CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm class="row mt-2">
                <div class="col-auto">
                  <CFormSelect
                    aria-label="Default select example"
                    v-model="partnerSelected"
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
                    aria-label="Default select example"
                    v-model="partnerSelected"
                  >
                    <option value="">Selecione uma modalidade</option>
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
                    type="submit"
                    style="color: #fff"
                    @click="consulta()"
                    color="success"
                    class="mb-3 mr-2"
                    >Consultar</CButton
                  >
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody v-if="tableVisible">
            <div class="mb-3">
              <strong>Total de bilhetes:</strong> {{ totalBilhetes }}
            </div>
            <div class="mb-3">
              <strong>Valor Total:</strong> {{ valorTotal }}
            </div>
            <div class="mb-3">
              <strong>Total de usuários:</strong> {{ totalUsuarios }}
            </div>

            <div class="mb-3" v-if="data.length > 0">
              <CButton
                style="color: #fff"
                @click="generatePDF()"
                class="mr-2"
                color="primary"
              >
                Gerar PDF
              </CButton>
            </div>

            <table class="table" id="pdf-table">
              <thead>
                <tr>
                  <th scope="col" width="10%">ID</th>
                  <th scope="col" width="20%">Nome do Usuário</th>
                  <th scope="col" width="20%">Bilhete</th>
                  <th scope="col" width="20%">Valor Aposta</th>
                  <th scope="col" width="20%">Data da Postagem</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data" :key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.bilhetes }}</td>
                  <td>R$ {{ item.valor }}</td>
                  <td>{{ item.criacao }}</td>
                </tr>
              </tbody>
            </table>
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
      partnerSelected: '',
      data: [],
      tableVisible: false,
      modalVisible: false,
      modalDisabled: false,
      readOnly: false,
      totalBilhetes: 0,
      valorTotal: 0,
      totalUsuarios: 0,
      inicio: null,
      fim: null,
    }
  },
  mounted() {
    this.listPartners()
  },
  methods: {
    generatePDF() {
      const doc = new jsPDF()
      doc.text('Total de bilhetes: ' + this.totalBilhetes, 3, 15)
      doc.text('Total de usuários: ' + this.totalUsuarios, 3, 25)
      doc.text('Valor total: ' + this.valorTotal, 3, 35)
      doc.autoTable({ html: '#pdf-table', startY: 45 })
      doc.save('dados.pdf')
    },
    listPartners() {
      api
        .get(`/partners`)
        .then((response) => {
          this.partners = response.data
        })
        .catch(() => {})
    },
    consulta() {
      api
        .get(`/apostas-feitas`)
        .then((response) => {
          if (response.data.success) {
            this.data = response.data.data
            this.tableVisible = true
          }
          // this.winners = response.data
          // this.calcularTotais()
          // this.tableVisible = true
        })
        .catch(() => {})
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
</style>
