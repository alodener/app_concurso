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
                    v-model="banca"
                    aria-label="Default select example"
                  >
                    <option value="">Selecione uma Banca</option>
                    <option value="LOTERIA">Loteria</option>
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
              <strong>Valor Total:</strong> R$ {{ valorTotal }}
            </div>
            <div class="mb-3">
              <strong>Total de usuários:</strong> {{ totalUsuarios }}
            </div>
            <div class="mb-3">
              <strong>Concursos:</strong> {{ data.concursos }}
            </div>

            <div class="mb-3" v-if="data.info.length > 0">
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
                  <th scope="col" width="20%">Usuário</th>
                  <th scope="col" width="20%">Bilhete</th>
                  <th scope="col" width="20%">Aposta</th>
                  <th scope="col" width="20%">Prêmio</th>
                  <th scope="col" width="20%">Data</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in data.info" :key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.bilhete }}</td>
                  <td>R$ {{ item.valor }}</td>
                  <td>R$ {{ item.premio }}</td>
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
      modalidade: '',
      banca: '',
      data: [],
      tableVisible: false,
      readOnly: false,
      totalBilhetes: 0,
      valorTotal: 0,
      totalUsuarios: 0,
      inicio: null,
      fim: null,
    }
  },
  methods: {
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

      const params = {
        banca: this.banca,
        modalidade: this.modalidade,
        inicio: this.inicio,
        fim: this.fim,
      }
      api
        .post(`/apostas-feitas/show`, params)
        .then((response) => {
          if (response.status == 200 && response.data.success) {
            this.data = response.data.data
            this.valorTotal = response.data.data.valorTotal
            this.totalUsuarios = response.data.data.totalUsuarios
            this.totalBilhetes = response.data.data.totalBilhetes
            this.tableVisible = true
          }
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
