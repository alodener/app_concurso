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
  <div>
    <CCard class="mb-5">
      <CCardBody class="m-auto"><h4>Aprovar Bichão da Sorte</h4></CCardBody>
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
                    :disabled="readOnly"
                    v-model="date"
                    type="date"
                    aria-label="First name"
                  />
                </div>
                <div class="col-auto d-flex align-items-center">
                  <CButton
                    type="submit"
                    @click="listWinners()"
                    color="success"
                    class="mb-3 mr-2"
                    >Consultar</CButton
                  >
                  <CButton
                    @click="aprovarTodos()"
                    color="info"
                    class="mb-3 text_button"
                  >
                    Aprovar Todos
                  </CButton>
                  <CButton
                    @click="acordoParaTodos()"
                    color="warning"
                    class="mb-3 text_button"
                  >
                    Acordo p/todos
                  </CButton>
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody v-if="tableVisible">
            <div class="mb-3">
              <strong>Total de ganhadores:</strong> {{ totalGanhadores }}
            </div>
            <div class="mb-3">
              <strong>Valor Total:</strong> {{ valorTotal }}
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">
                    <CButton @click="selectAll()" class="mr-2" color="primary">
                      Marcar todos
                    </CButton>
                  </th>
                  <th scope="col" width="10%">ID</th>
                  <th scope="col" width="20%">Nome do Usuário</th>
                  <th scope="col" width="20%">Premio</th>
                  <th scope="col" width="20%">Bilhete</th>
                  <th scope="col" width="20%">Modalidade</th>
                  <th scope="col" width="20%">Banca</th>
                  <th scope="col" width="20%">Status</th>
                  <th scope="col" width="20%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.game_id">
                  <td>
                    <input type="checkbox" v-model="item.checked" />
                    <!-- <input type="checkbox" id="{checkbox}" v-model="checked" /> -->
                  </td>
                  <th scope="row">{{ item.game_id }}</th>
                  <td>{{ item.client_full_name }}</td>
                  <td>{{ item.valor_premio }}</td>
                  <td>{{ item.game_1 }}</td>
                  <td>{{ item.modalidade_name }}</td>
                  <td>{{ item.banca }}</td>
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
                        @click="openModal(item.game_id, 3)"
                        class="mr-2"
                        color="info"
                        >Acordo</CButton
                      >
                      <CButton
                        @click="openModal(item.game_id, 2)"
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
      premio: '',
      winners: [],
      checked: '',
      date: '',
      tableVisible: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,
      readOnly: false,
      ganhadores: '',
      totalGanhadores: 0,
      valorTotal: 0,
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
    openModalGanhadores() {
      this.modalGanhadores = true
    },
    aprovarTodos0() {
      const selectedItems = this.winners.filter((item) => item.checked)
      console.log(selectedItems)

      if (selectedItems.length === 0) {
        alert('Nenhum ganhador pendente selecionado para aprovação.')
        return
      }
      // eslint-disable-next-line
      if (window.confirm('Deseja realmente aprovar todos os ganhadores pendentes?')) {
        const approvePromises = selectedItems.map((item) =>
          // eslint-disable-next-line
          api.put(`/partners/update-status-bichao`, { partner: this.partnerSelected, id: item.game_id, status: 2 })
        )

        Promise.all(approvePromises)
          .then(() => {
            this.listWinners()
          })
          .catch((error) => {
            console.error('Erro ao aprovar ganhadores:', error)
          })
      }
    },
    aprovarTodos() {
      const selectedItems = this.winners.filter((item) => item.checked)
      console.log(selectedItems)

      if (selectedItems.length === 0) {
        alert('Nenhum ganhador pendente selecionado para aprovação.')
        return
      }
      // eslint-disable-next-line
      if (window.confirm('Deseja realmente aprovar todos os ganhadores pendentes?')) {
        // Extrai os game_id para um array
        const gameIds = selectedItems.map((item) => item.game_id)
        /* eslint-disable */
        // eslint-disable-next-line
        api.put(`/partners/update-status-bichao`, {
          partner: this.partnerSelected,
          ids: gameIds,
          status: 2
        })
        .then(() => {
          this.listWinners()
        })
        .catch((error) => {
          console.error('Erro ao aprovar ganhadores:', error)
        })
      }
    },
    acordoParaTodos() {
      const selectedItems = this.winners.filter((item) => item.checked)

      if (selectedItems.length === 0) {
        alert('Nenhum ganhador pendente selecionado para acordo.')
        return
      }
      // eslint-disable-next-line
      if (window.confirm('Deseja realmente entrar em acordo para todos os ganhadores pendentes?')) {
        const agreementPromises = selectedItems.map((item) =>
          // eslint-disable-next-line
          api.put(`/partners/update-status-bichao`, { partner: this.partnerSelected, id: item.game_id, status: 3 })
        )

        Promise.all(agreementPromises)
          .then(() => {
            this.listWinners()
          })
          .catch((error) => {
            console.error('Erro ao entrar em acordo com ganhadores:', error)
          })
      }
    },
    listWinners() {
      api
        .get(
          `/partners/bichao-results?partner=${this.partnerSelected}&date=${this.date}`,
        )
        .then((response) => {
          this.winners = response.data
          this.calcularTotais()
          this.tableVisible = true
        })
        .catch(() => {})
    },
    calcularTotais() {
      const pessoasUnicas = {}

      this.winners.forEach((item) => {
        const nome = item.name

        if (pessoasUnicas[nome]) {
          pessoasUnicas[nome].valor += parseFloat(item.premio)
        } else {
          pessoasUnicas[nome] = {
            valor: parseFloat(item.premio),
          }
        }
      })

      this.totalGanhadores = Object.keys(pessoasUnicas).length

      this.valorTotal = Object.values(pessoasUnicas).reduce(
        (total, pessoa) => total + pessoa.valor,
        0,
      )
    },
    openModal(id, status) {
      this.modalVisible = true
      this.body = {
        partner: this.partnerSelected,
        id,
        status,
      }
    },
    // selectAll() {
    //   this.checked = !this.checked
    //   this.winners.forEach((item) => {
    //     this.$set(item, 'selected', this.checked)
    //   })
    // },
    selectAll() {
      const allChecked = this.winners.every((item) => item.checked)
      this.winners.forEach((item) => {
        item.checked = !allChecked
      })
    },
    updateStatus() {
      this.modalDisabled = true
      api
        .put(`/partners/update-status-bichao`, this.body)
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
