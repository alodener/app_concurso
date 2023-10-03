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
  <div>
    <CCard class="mb-5">
      <CCardBody class="m-auto"><h4>Aprovar Premio</h4></CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm class="row mt-5">
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
                  <CFormLabel for="inputPassword2" class="visually-hidden"
                    >Password</CFormLabel
                  >
                  <CFormInput
                    type="text"
                    id="inputPassword2"
                    placeholder="Numero do Concurso"
                    v-model="number"
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
          <CCardBody v-if="tableVisible">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">ID</th>
                  <th scope="col" width="20%">Nome do Usuário</th>
                  <th scope="col" width="20%">Premio</th>
                  <th scope="col" width="20%">Status</th>
                  <th scope="col" width="20%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.premio }}</td>
                  <td>
                    <CBadge
                      v-if="item.status == 1"
                      color="warning"
                      shape="rounded-pill"
                      >Pendente</CBadge
                    >
                    <CBadge
                      v-if="item.status == 2"
                      color="success"
                      shape="rounded-pill"
                      >Aprovado</CBadge
                    >
                    <CBadge
                      v-if="item.status == 3"
                      color="info"
                      shape="rounded-pill"
                      >Acordo</CBadge
                    >
                  </td>
                  <td class="d-flex">
                    <CButtonGroup role="group" v-if="item.status == 1">
                      <CButton
                        @click="openModal(item.id, 3)"
                        class="mr-2"
                        color="info"
                        >Acordo</CButton
                      >
                      <CButton
                        @click="openModal(item.id, 2)"
                        class="mr-2"
                        color="success"
                        >Aprovar</CButton
                      >
                    </CButtonGroup>
                    <div v-if="item.status != 1">
                      <CButton disabled color="secondary" variant="outline"
                        >Sem Ação Disponivel</CButton
                      >
                    </div>
                  </td>
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
export default {
  name: 'AprovarPremio',
  data() {
    return {
      partners: [],
      partnerSelected: '',
      number: '',
      winners: [],
      tableVisible: false,
      modalVisible: false,
      bodyStatusUpdate: null,
      modalDisabled: false,
    }
  },
  mounted() {
    this.listPartners()
  },
  methods: {
    listPartners() {
      api
        .get(`/partners`)
        .then((response) => {
          this.partners = response.data
        })
        .catch(() => {})
    },
    listWinners() {
      api
        .get(
          `/partners/get-result?partner=${this.partnerSelected}&number=${this.number}`,
        )
        .then((response) => {
          this.winners = response.data
          this.tableVisible = true
          console.log(this.winners)
        })
        .catch(() => {})
    },
    openModal(id, status) {
      this.modalVisible = true
      this.body = {
        partner: this.partnerSelected,
        id,
        status,
      }
    },
    updateStatus() {
      this.modalDisabled = true
      api
        .put(`/partners/update-status`, this.body)
        .then(() => {
          this.listWinners()
          this.modalVisible = false
          this.modalDisabled = false
        })
        .catch(() => {
          this.modalVisible = false
        })
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
