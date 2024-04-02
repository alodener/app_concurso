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
      <CCardBody class="m-auto"><h4>Excluir Concurso</h4></CCardBody>
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
                    v-model="partnersSelected"
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
                    type="text"
                    id="inputPassword2"
                    placeholder="Numero do Concurso"
                    v-model="number"
                  />
                </div>
                <div class="col-auto d-flex align-items-center">
                  <CButton
                    type="submit"
                    @click="listCompetitions()"
                    color="success"
                    class="same-height-button"
                  >
                    Consultar
                  </CButton>
                  <CButton
                    type="submit"
                    @click="confirmDelete()"
                    color="danger"
                    class="same-height-button"
                  >
                    Excluir Marcados
                  </CButton>
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody v-if="tableVisible">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">
                    <CButton @click="selectAll()" class="mr-2" color="primary">
                      Marcar todos
                    </CButton>
                  </th>
                  <th scope="col" width="20%">ID</th>
                  <th scope="col" width="20%">Data Sorteio</th>
                  <th scope="col" width="20%">Número</th>
                  <th scope="col" width="20%">Jogo</th>
                  <th scope="col" width="10%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" :key="item.id">
                  <td>
                    <input type="checkbox" v-model="item.checked" />
                  </td>
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.sort_date }}</td>
                  <td>{{ item.number }}</td>
                  <td>{{ item.type_game_name }}</td>
                  <td>
                    <CButton
                      color="danger"
                      @click="confirmDelete(item.id, item.partner_id)"
                    >
                      Excluir
                    </CButton>
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
      selectedPartner: '',
      partnersSelected: [],
      selectedItems: [],
      number: '',
      premio: '',
      winners: [],
      tableVisible: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,
      ganhadores: '',
      readOnly: false,
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
    getSelectedItems() {
      return this.winners.filter((item) => item.checked)
    },
    selectAll() {
      const allChecked = this.winners.every((item) => item.checked)
      this.winners.forEach((item) => {
        item.checked = !allChecked
      })
    },
    confirmDelete() {
      const selectedItems = this.getSelectedItems()

      if (selectedItems.length === 0) {
        alert('Nenhum item selecionado para exclusão.')
        return
      }

      if (window.confirm('Deseja realmente excluir os itens selecionados?')) {
        const deletePromises = selectedItems.map((item) =>
          // eslint-disable-next-line
          api.delete(`/partners/delete-competition?id=${item.id}&partner=${item.partner_id}`)
        )

        Promise.all(deletePromises)
          .then(() => {
            this.listCompetitions()
          })
          .catch((error) => {
            console.error('Erro ao excluir itens:', error)
          })
      }
    },
    listCompetitions() {
      const partnersString = this.partnersSelected.join(',')

      api
        .get(`/partners/list-competitions`, {
          params: {
            partners: partnersString,
            number: this.number,
          },
        })
        .then((response) => {
          this.winners = response.data
          this.tableVisible = true
          console.log(this.winners)
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
.same-height-button {
  height: 50px;
}
</style>
