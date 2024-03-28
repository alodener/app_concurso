<template>
  <CModal :visible="modalVisible" size="lg">
    <CModalHeader>
      <CModalTitle>Enviar ao Escritório</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" width="10%">ID</th>
              <th scope="col" width="20%">Nome do Usuário</th>
              <th scope="col" width="20%">Prêmio</th>
              <th scope="col" width="20%">Bilhetes</th>
              <th scope="col" width="20%">Modalidade</th>
              <th scope="col" width="20%">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in winners" v-bind:key="item.id">
              <th scope="row">{{ item.id }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.premio_formatted }}</td>
              <td>{{ item.num_tickets }}</td>
              <td>{{ item.game_name }}</td>
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
                  >Acordo
                </CBadge>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CModalBody>
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
      <CCardBody class="m-auto"><h4>Lista de Ganhadores</h4></CCardBody>
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
                      :value="[item.id, item.name]"
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
                <div class="col-auto">
                  <CButton
                    type="submit"
                    @click="listWinners()"
                    color="success"
                    class="mb-3"
                    >Consultar</CButton
                  >
                </div>
                <div class="col-auto">
                  <CFormInput
                    type="text"
                    id="premio"
                    placeholder="Valor à adicionar"
                    v-model="premio"
                  />
                </div>
                <div class="col-auto">
                  <CFormInput
                    type="text"
                    id="ganhadores"
                    placeholder="Ganhadores à adicionar"
                    v-model="ganhadores"
                  />
                </div>
                <div class="col-auto">
                  <CButton
                    type="submit"
                    @click="listFakeWinners"
                    color="warning"
                    class="mb-3"
                    >Adicionar Ganhadores</CButton
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
                  <th scope="col" width="20%">Prêmio</th>
                  <th scope="col" width="20%">Bilhetes</th>
                  <th scope="col" width="20%">Modalidade</th>
                  <th scope="col" width="20%">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.premio_formatted }}</td>
                  <td>{{ item.num_tickets }}</td>
                  <td>{{ item.game_name }}</td>
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
                </tr>
              </tbody>
            </table>
            <div class="button-container fixed-buttons">
              <CButton
                v-show="tableVisible"
                class="copy-button btn btn-primary btn-lg"
                color="primary"
                @click="copyToClipboard"
                id="botaoCopiarListaGanhadores"
              >
                Copiar Lista Ganhadores
              </CButton>
              <CButton
                v-show="tableVisible"
                class="send-button btn btn-success btn-lg"
                color="success"
                @click="openModal"
                id="enviarAoEscritorio"
              >
                Enviar ao Escritório
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
      partnerSelectedId: null,
      partnerSelectedName: null,
      number: '',
      premio: '',
      date: '',
      winners: [],
      tableVisible: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,
      ganhadores: '',
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
    formatTableContent() {
      const totalGeral = this.winners.reduce((total, winner) => {
        let valorNumerico

        if (typeof winner.premio === 'string') {
          // eslint-disable-next-line
          valorNumerico = parseFloat(winner.premio.replace(/\./g, '').replace(',', '.'))
        } else {
          valorNumerico = winner.premio
        }

        return total + valorNumerico
      }, 0)

      const totalTickets = this.winners.reduce((total, winner) => {
        return total + parseFloat(winner.num_tickets)
      }, 0)

      // eslint-disable-next-line no-multi-spaces
      let formattedContent = `🤑 ${this.partnerSelectedName} 🤑\n`
      formattedContent += `SORTEIOS DO DIA: ${this.winners[0].sort_date}`
      formattedContent += `\n`
      // eslint-disable-next-line
      formattedContent += `PREMIAÇÕES GERAIS: ${totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
      formattedContent += `\n`
      formattedContent += `TOTAL DE BILHETES: ${totalTickets}`
      formattedContent += `\n`
      const groupedByGame = {}

      this.winners.forEach((item) => {
        if (!groupedByGame[item.game_name]) {
          groupedByGame[item.game_name] = []
        }
        groupedByGame[item.game_name].push(item)
      })

      Object.keys(groupedByGame).forEach((gameName) => {
        formattedContent += `\n🟡 ${gameName}\n`

        groupedByGame[gameName].forEach((winner) => {
          formattedContent += `✔️ ${winner.name}, ${winner.num_tickets} cupons\n`
          formattedContent += `💰 Prêmio: ${winner.premio_formatted}\n`
          formattedContent += `\n`
        })

        // eslint-disable-next-line
        // formattedContent += `\nTotal de Prêmios 💰 ${totalPrize.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 💰\n`
      })

      return formattedContent
    },
    openModal() {
      this.modalVisible = true
    },
    closeModal() {
      this.modalVisible = false
    },
    copyToClipboard() {
      const tableContent = this.formatTableContent()

      if (tableContent) {
        const tempTextArea = document.createElement('textarea')
        tempTextArea.value = tableContent

        document.body.appendChild(tempTextArea)

        tempTextArea.select()

        document.execCommand('copy')

        document.body.removeChild(tempTextArea)

        alert('Conteúdo copiado para a área de transferência!')
      } else {
        console.error('Conteúdo da tabela não encontrado.')
      }
    },
    openModalGanhadores() {
      this.modalGanhadores = true
    },
    listWinners() {
      const parts = this.partnerSelected.split(',')

      this.partnerSelectedId = parts[0]
      this.partnerSelectedName = parts[1]
      api
        .get(
          `/partners/get-result?partner=${this.partnerSelectedId}&number=${this.date}`,
        )
        .then((response) => {
          this.winners = response.data
          this.tableVisible = true
          console.log(this.partnerSelected)
        })
        .catch(() => {})
    },
    listFakeWinners() {
      const parts = this.partnerSelected.split(',')

      this.partnerSelectedId = parts[0]
      this.partnerSelectedName = parts[1]
      api
        .get(
          `/partners/get-result2?partner=${this.partnerSelectedId}&number=${this.date}&premio=${this.premio}&ganhadores=${this.ganhadores}`,
        )
        .then((response) => {
          this.winners = response.data
          this.tableVisible = true
          console.log(this.winners)
        })
        .catch(() => {})
    },
    // openModal(id, status) {
    //   this.modalVisible = true
    //   this.body = {
    //     partner: this.partnerSelected,
    //     id,
    //     status,
    //   }
    // },
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
</style>
