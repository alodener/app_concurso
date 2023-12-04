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
                  <th scope="col" width="20%">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.premio_formatted }}</td>
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
      partnerSelected: '',
      number: '',
      premio: '',
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
      // eslint-disable-next-line no-multi-spaces
      let formattedContent = `🤑SuperLotogiro🤑\n`
      formattedContent += `SORTEIOS DO DIA: ${this.winners[0].sort_date}`
      formattedContent += `\n`
      formattedContent += `\n🟡 ${this.winners[0].game_name}\n`

      let totalPrize = 0

      this.winners.forEach((item) => {
        formattedContent += `✔️ ${item.name}, ${item.num_tickets} cupons\n`
        formattedContent += `💰 Prêmio: ${item.premio}\n`
        formattedContent += `\n`
        totalPrize += parseFloat(item.premio)
      })

      formattedContent += `\nTotal de Prêmios 💰 ${totalPrize.toFixed(2)} 💰\n`

      return formattedContent
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
    // copyToClipboard() {
    //   const contentToCopy = 'Conteúdo que deseja copiar'

    //   const tempInput = document.createElement('textarea');
    //   tempInput.value = contentToCopy
    //   document.body.appendChild(tempInput)
    //   tempInput.select()
    //   document.execCommand('copy')
    //   document.body.removeChild(tempInput)

    //   console.log('Conteúdo copiado para a área de transferência:', contentToCopy)
    // },
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
    listFakeWinners() {
      api
        .get(
          `/partners/get-result2?partner=${this.partnerSelected}&number=${this.number}&premio=${this.premio}&ganhadores=${this.ganhadores}`,
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
