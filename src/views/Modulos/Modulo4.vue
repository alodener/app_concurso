<template>
  <CModal :visible="modalVisible">
    <CModalHeader>
      <CModalTitle>Deseja Realmente Enviar os resultados?</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton color="success" @click="updateDrawNumbers()">Criar</CButton>
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
          >Resutlados Enviados com Sucesso!</CAlert
        >
        <CAlert v-if="failCreate" class="text-center" color="danger"
          >Erro ao atualizar números!</CAlert
        >
        <CCard>
          <CCardHeader class="pt-3 pb-3 text-center"
            ><h4 class="m-auto">Sobrepor Resultado</h4></CCardHeader
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
            <!-- <CInputGroup class="mt-4">
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
              </CFormSelect>
            </CInputGroup> -->
            <CInputGroup class="mt-4">
              <CInputGroupText>Resultados</CInputGroupText>
              <CFormInput
                :disabled="readOnly"
                v-model="result"
                aria-label="First name"
                @blur="validarResultadosLoteria(result, false)"
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
  name: 'SobreporResultado',
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

      // if (numeros.length !== 9) {
      //   this.errorResult =
      //     'Você deve digitar exatamente 9 números separados por vírgulas'
      //   return
      // }
      this.errorResult = '' // Sem erros
    },
    updateDrawNumbers() {
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
          result: this.result,
        }

        api
          .post(`/partners/update-draw-numbers`, body)
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
      if (this.result == null) {
        return false
      } else {
        let validador = this.validarResultadosLoteria(this.result)
        if (validador != null) {
          alert(validador)
        }
      }

      if (this.number == null) {
        return false
      }
      if (this.partnersSelected.length == 0) {
        return false
      }
      return true
    },
    clearInputs() {
      this.number = null
      this.result = null
      this.partnersSelected = []
      this.readOnly = false
    },
  },
}
</script>
