<template>
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

  <CModal :visible="modalListaGamesInformations" style="width: 50vw !important">
    <CModalHeader>
      <CModalTitle>Detalhes dos Ganhadores/Prêmios</CModalTitle>
    </CModalHeader>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th scope="col" width="10%">ID</th>
            <th scope="col" width="20%">Usuário</th>
            <th scope="col" width="20%">Premio</th>
            <th scope="col" width="20%">Jogo</th>
            <th scope="col" width="20%">Avulso</th>
            <th scope="col" width="20%">Status</th>
            <th scope="col" width="20%">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in listaGamesInformations" v-bind:key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.premio_formatted }}</td>
            <td>{{ item.game_name }}</td>
            <td>{{ item.random_game }}</td>
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
              <CBadge v-if="item.status == 3" color="info" shape="rounded-pill"
                >Acordo</CBadge
              >
              <CBadge
                v-if="item.status == 4"
                color="primary"
                shape="rounded-pill"
                >Auto</CBadge
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
                  >-/-</CButton
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </CModal>
  <div>
    <Modal
      :modalVisible="modalVisible"
      title="Deseja Realmente alterar o status?"
      :onUpdateStatus="updateStatus"
      :onClose="closeModala"
    />
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
                    :disabled="readOnly"
                    v-model="date"
                    type="date"
                    aria-label="First name"
                  />
                </div>
                <div class="col-auto d-flex align-items-center">
                  <CButton
                    type="button"
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
                  <th scope="col" width="10%">Data do Sorteio</th>
                  <th scope="col" width="20%">Nome do Usuário</th>
                  <th scope="col" width="20%">Premio</th>
                  <th scope="col" width="20%">Tipo do Jogo</th>
                  <th scope="col" width="20%">Avulso</th>
                  <th scope="col" width="20%">Status</th>
                  <th scope="col" width="20%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <td>
                    <div
                      v-if="
                        item.status != 4 && item.status != 2 && item.status != 3
                      "
                    >
                      <input type="checkbox" v-model="item.checked" />
                      <!-- <input type="checkbox" id="{checkbox}" v-model="checked" /> -->
                    </div>
                  </td>
                  <th scope="row">{{ item.id[0] }}</th>
                  <td>{{ item.sort_date }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.premio_formatted }}</td>
                  <td>{{ item.game_name }}</td>
                  <td>{{ item.random_game }}</td>
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
                    <CBadge
                      v-if="item.status == 4"
                      color="primary"
                      shape="rounded-pill"
                      >Auto</CBadge
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
                      <div
                        v-if="
                          item.status != 1 &&
                          item.status != 4 &&
                          item.total_bilhetes == 1
                        "
                      >
                        <CButton disabled color="secondary" variant="outline"
                          >Sem Ação Disponivel</CButton
                        >
                      </div>

                      <div v-if="item.status == 4 && item.total_bilhetes > 1">
                        <CButton
                          type="button"
                          @click="informationUsers(item.id)"
                          color="success"
                          class="mb-3 mr-2"
                          >i</CButton
                        >
                      </div>
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
import modal from '../../components/Modal.vue'

export default {
  components: {
    Modal: modal, // Registra o componente para uso no template
  },
  name: 'AprovarPremio',
  data() {
    return {
      partners: [],
      partnerSelected: '',
      listaGamesInformations: [],
      number: '',
      premio: '',
      winners: [],
      checked: '',
      date: '',
      tableVisible: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,
      modalListaGamesInformations: false,
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
    informationUsers(ids) {
      this.listaGamesInformations = []
      this.modalListaGamesInformations = false
      var idsGames = JSON.stringify(ids)
      api
        .get(
          `/partners/game-informations?id=${idsGames}&partner=${this.partnerSelected}`,
        )
        .then((response) => {
          this.listaGamesInformations = response.data
          this.modalListaGamesInformations = true
        })
        .catch(() => {})
    },
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
    aprovarTodos() {
      const selectedItems = this.winners.filter((item) => item.checked)

      if (selectedItems.length === 0) {
        alert('Nenhum ganhador pendente selecionado para aprovação.')
        return
      }
      // eslint-disable-next-line
      if (window.confirm('Deseja realmente aprovar todos os ganhadores pendentes?')) {
        const approvePromises = selectedItems.map((item) =>
          // eslint-disable-next-line
          api.put(`/partners/update-status`, { partner: this.partnerSelected, id: item.id, status: 2 })
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
          api.put(`/partners/update-status`, { partner: this.partnerSelected, id: item.id, status: 3 })
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
          `/partners/aprove-prize?partner=${this.partnerSelected}&date=${this.date}`,
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
    closeModala() {
      this.modalVisible = false
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
        if (item.status == 4) {
          item.checked = false
        } else {
          item.checked = !allChecked
        }
      })
    },
    async updateStatus() {
      this.modalVisible = false
      await api
        .put(`/partners/update-status`, this.body)
        .then(() => {
          this.listWinners()
          this.modalVisible = false
          this.modalDisabled = false
        })
        .catch(() => {
          this.listWinners()
          this.modalVisible = false
          this.modalDisabled = false
        })
      this.listWinners()
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
