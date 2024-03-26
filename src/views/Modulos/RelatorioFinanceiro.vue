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
      <CCardBody class="m-auto"><h4>Relatório Financeiro</h4></CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm class="row mt-5">
                <div class="col-auto"></div>
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
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody v-if="tableVisible">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">Banca</th>
                  <th scope="col" width="20%">Depósito Pix</th>
                  <th scope="col" width="20%">Recarga Manual</th>
                  <th scope="col" width="20%">Pagamento Prêmios</th>
                  <th scope="col" width="20%">Pagamento de Bonús</th>
                  <th scope="col" width="20%">Valor Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <td>{{ item.banca }}</td>
                  <td>{{ item.dep_pix }}</td>
                  <td>{{ item.recarga_manual }}</td>
                  <td>{{ item.pag_premios }}</td>
                  <td>{{ item.pag_bonus }}</td>
                  <td
                    v-bind:class="{
                      'text-success': !item.valor_liquido.includes('-'),
                      'text-danger': item.valor_liquido.includes('-'),
                    }"
                  >
                    {{ item.valor_liquido }}
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
  methods: {
    openModalGanhadores() {
      this.modalGanhadores = true
    },
    listWinners() {
      api
        .get(`/partners/financeiro?number=${this.date}`)
        .then((response) => {
          this.winners = response.data
          this.tableVisible = true
          console.log(this.partnerSelected)
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
