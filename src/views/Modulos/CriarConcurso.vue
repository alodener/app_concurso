<template>
  <CModal :visible="modalVisible">
    <CModalHeader>
      <CModalTitle>Deseja Realmente Criar os Concursos?</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton color="success" @click="createContests()">Criar</CButton>
    </CModalFooter>
  </CModal>
  <div>
    <CRow>
      <CCol :md="7" class="m-auto mt-5">
        <CAlert v-if="inputFilledError" class="text-center" color="danger"
          >Preencha todos os campos!</CAlert
        >
        <CAlert v-if="successCreate" class="text-center" color="success"
          >Criação Concluida com Sucesso!</CAlert
        >
        <CAlert v-if="failCreate" class="text-center" color="danger"
          >Erro ao Criar Concursos!</CAlert
        >
        <CCard>
          <CCardHeader class="pt-3 pb-3 text-center"
            ><h4 class="m-auto">Criar Concursos</h4></CCardHeader
          >
          <CCardBody>
            <CInputGroup class="mt-2">
              <CInputGroupText>Numero</CInputGroupText>
              <CFormInput
                :disabled="readOnly"
                v-model="number"
                aria-label="First name"
              />
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Categorias</CInputGroupText>
              <CFormSelect
                :disabled="readOnly"
                v-model="category"
                aria-label="Default select example"
              >
                <option value="">Selecione uma Categoria</option>
                <option value="loto_facil">Loto Fácil</option>
                <option value="quina">Quina</option>
                <option value="mega_sena">Mega Sena</option>
                <option value="dia_de_sorte">Dia De Sorte</option>
                <option value="dupla_sena">Dupla Sena</option>
                <option value="loto_mania">Loto Mania</option>
                <option value="time_mania">Time Mania</option>
                <option value="dupla_sena_dobrada">Dupla Sena Dobrada</option>
                <option value="lotinha_corujao">Lotinha Corujão</option>
                <option value="mais_milionaria">Mais Milionaria</option>
                <option value="loto_one">Loto ONE</option>
                <option value="loto_quatorze">Loto 14</option>
                <option value="kino_loto">Kino Loto</option>
                <option value="rekino_loto">Rekino Loto</option>
                <option value="chanchito_Loto">Chanchito Loto</option>
                <option value="easy_power_loto">Easy Power Loto</option>
                <option value="chao_jefe_loto">Chao Jefe Loto</option>
                <option value="chispaloto_noite">Chispaloto Noite</option>
                <option value="mega_lotto">Mega Lotto</option>
                <option value="mega_kino">Mega Kino</option>
                <option value="santa_lucia_double">Santa Lucia Double</option>
                <option value="super_quina">Super Quina</option>
                <option value="cash_life">Cash Life</option>
                <option value="ny_lotto">Ny Lotto</option>
                <option value="mega_power">Mega Power</option>
                <option value="la_tinka">La Tinka</option>
                <option value="super_six">Super Six</option>
                <option value="loto_ouro">Loto Ouro</option>
              </CFormSelect>
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Data do Sorteio</CInputGroupText>
              <CFormInput
                :disabled="readOnly"
                v-model="date"
                type="date"
                aria-label="First name"
              />
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Hora do Sorteio</CInputGroupText>
              <CFormInput
                :disabled="readOnly"
                v-model="time"
                type="time"
                aria-label="First name"
              />
            </CInputGroup>
            <v-select
              :disabled="readOnly"
              v-model="partnersSelected"
              :items="partners"
              item-title="name"
              item-value="id"
              chips
              label="Bancas"
              multiple
              class="mt-4"
            ></v-select>
          </CCardBody>
          <CCardFooter class="d-flex botao_footer">
            <div v-show="timeToFinishVisible">
              <strong
                >Tempo de Processamento: {{ timeToFinish }} Segundos</strong
              >
            </div>
            <div>
              <v-btn
                color="#2eb85c"
                :loading="loadingButton"
                @click="openModal()"
              >
                Criar Concurso
              </v-btn>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import api from '@/plugins/axios'
export default {
  name: 'CriarConcurso',
  data() {
    return {
      partners: [],
      partnersSelected: [],
      number: null,
      category: null,
      date: null,
      time: null,
      modalVisible: false,
      loadingButton: false,
      timeToFinishVisible: false,
      timeToFinish: null,
      inputFilledError: false,
      successCreate: false,
      failCreate: false,
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
    createContests() {
      var inputsError = this.inputsFilled()

      if (inputsError) {
        this.loadingButton = true
        this.modalVisible = false
        this.readOnly = true
        this.timeToFinishVisible = true
        this.timeToFinish = this.partnersSelected.length * 3

        const body = {
          partners: this.partnersSelected,
          number: this.number,
          category: this.category,
          date_of_sort: this.date + ' ' + this.time + ':00',
        }
        api
          .post(`/partners`, body)
          .then((response) => {
            console.log(response)
            this.loadingButton = false
            this.timeToFinishVisible = false
            this.successCreate = true
            this.clearInputs()
          })
          .catch(() => {
            this.failCreate = true
          })
      }
      if (!inputsError) {
        this.inputFilledError = true
        this.modalVisible = false
        this.successCreate = false
      }
    },
    openModal() {
      this.modalVisible = true
    },
    inputsFilled() {
      if (this.number == null) {
        return false
      }
      if (this.category == null) {
        return false
      }
      if (this.date == null) {
        return false
      }
      if (this.time == null) {
        return false
      }
      if (this.partnersSelected.length == 0) {
        return false
      }
      return true
    },
    clearInputs() {
      this.number = null
      this.category = null
      this.date = null
      this.time = null
      this.partnersSelected = []
      this.readOnly = false
    },
  },
}
</script>

<style>
.botao_footer {
  justify-content: space-between;
}
</style>
