<template>
  <CModal :visible="modalVisible">
    <CModalHeader>
      <CModalTitle>Deseja Realmente Enviar os resultados?</CModalTitle>
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
        <CAlert v-if="errorResult != ''" class="text-center" color="danger">
          {{ errorResult }}</CAlert
        >
        <CAlert v-if="successCreate" class="text-center" color="success"
          >Criação Concluida com Sucesso!</CAlert
        >
        <CAlert v-if="failCreate" class="text-center" color="danger"
          >Erro ao Criar Concursos!</CAlert
        >
        <CCard>
          <CCardHeader class="pt-3 pb-3 text-center"
            ><h4 class="m-auto">Enviar Resultado</h4></CCardHeader
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
                <option value="chispaloto_segundo">Chispaloto Segundo</option>
                <option value="mega_lotto">Mega Lotto</option>
                <option value="mega_kino">Mega Kino</option>
                <option value="santa_lucia_double">Santa Lucia Double</option>
                <option value="super_quina">Super Quina</option>
              </CFormSelect>
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Resultados</CInputGroupText>
              <CFormInput
                :disabled="readOnly"
                v-model="result"
                @blur="validarResultadosLoteria(result, false)"
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
                Enviar Resultado
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
  name: 'EnviarResultado',
  data() {
    return {
      partners: [],
      partnersSelected: [],
      number: null,
      category: null,
      result: null,
      errorResult: '',
      modalVisible: false,
      loadingButton: false,
      timeToFinishVisible: false,
      timeToFinish: null,
      inputFilledError: false,
      successCreate: false,
      failCreate: false,
      readOnly: false,
      maxNumers: {
        loto_facil: 15,
        quina: 5,
        mega_sena: 6,
        loto_mania: 20,
        dia_de_sorte: 7,
        time_mania: 7,
        dupla_sena: 6,
        mais_milionaria: 6,
        lotinha_corujao: 5,
        loto_one: 5,
        santa_lucia_double: 4,
        kino_loto: 14,
        rekino_loto: 14,
        chanchito_Loto: 14,
        chao_jefe_loto: 14,
        mega_kino: 15,
      },
    }
  },
  watch: {
    result(newVal) {
      this.validarResultadosLoteria(newVal, true)
    },
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
          result: this.result,
        }

        api
          .post(`/partners/send-result`, body)
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
    verificarString(string) {
      string = string.replace(', ', ',')

      const partes = string.replace(/\s+/g, '').split(',')

      for (let parte of partes) {
        if (!/^0\d*|^[1-9]\d*$/.test(parte.trim())) {
          return false
        }
      }
      return true
    },
    inputsFilled() {
      if (this.number == null) {
        return false
      }
      if (this.category == null) {
        return false
      }

      const verify =
        this.category == 'loto_mania' && this.result != null
          ? this.verificarString(this.result)
          : /^(0[1-9]|[1-9]|[1-9]\d)(?:,\s*(0[1-9]|[1-9]|[1-9]\d))*$/

      if (this.result == null || verify == false) {
        return false
      }
      if (this.partnersSelected.length == 0) {
        return false
      }
      return true
    },
    validarResultadosLoteria(input, oninput = false) {
      if (!input) {
        return
      }
      input = input.replace(/\s+/g, ',')
      const numeros = input.split(',').map((numero) => numero.trim()) // Divide por vírgulas e remove espaços
      console.log(numeros)
      const regex = /^[0-9]{2}$/ // Apenas dois dígitos numéricos
      const vistos = new Set()

      for (let i = 0; i < numeros.length; i++) {
        if (i === numeros.length - 1 && oninput) {
          break
        }
        if (!regex.test(numeros[i])) {
          this.errorResult = `O caractere '${numeros[i]}' está incorreto Use apenas números de dois dígitos no formato 01, 02, etc`
          return
        }
        if (vistos.has(numeros[i])) {
          this.errorResult = `O número '${numeros[i]}' foi repetido`
          return
        }
        vistos.add(numeros[i])
      }
      let max
      let podeMax = true
      if (this.category in this.maxNumers) {
        max = this.maxNumers[this.category]
      } else {
        max = 15
        podeMax = false //
      }

      if (numeros.length !== max && !oninput && podeMax) {
        this.errorResult = `Você deve digitar exatamente ${max} números separados por vírgulas`
        return
      }
      this.errorResult = '' // Sem erros
    },
    clearInputs() {
      this.number = null
      this.category = null
      this.result = null
      this.partnersSelected = []
      this.readOnly = false
    },
  },
}
</script>
