<template>
  <div>
    <CRow>
      <CCol :md="7" class="m-auto mt-5">
        <CAlert v-if="createError" class="text-center" color="danger"
          >Preencha todos os campos!</CAlert
        >
        <CCard>
          <CCardHeader class="pt-3 pb-3 text-center"
            ><h4 class="m-auto">Criar Novo Usuário</h4></CCardHeader
          >
          <CCardBody>
            <CInputGroup class="mt-2">
              <CInputGroupText>Nome</CInputGroupText>
              <CFormInput
                v-model="data.name"
                required
                aria-label="First name"
              />
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Email</CInputGroupText>
              <CFormInput v-model="data.email" aria-label="First name" />
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Permissão</CInputGroupText>
              <CFormSelect
                v-model="data.role"
                aria-label="Default select example"
              >
                <option value="">Selecione uma permissão</option>
                <option value="socio">Sócio</option>
                <option value="admin">Admin</option>
                <option value="gerente_jogo">Gerente de Jogos</option>
                <option value="gestor_resultado">Gestor de Resultados</option>
                <option value="marketing">Marketing</option>
              </CFormSelect>
            </CInputGroup>
            <CInputGroup class="mt-4">
              <CInputGroupText>Senha</CInputGroupText>
              <CFormInput v-model="data.password" aria-label="First name" />
            </CInputGroup>
          </CCardBody>
          <CCardFooter class="d-flex botao_footer">
            <CButton color="success" block @click="createUser()"
              >Criar Conta</CButton
            >
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import api from '@/plugins/axios'
export default {
  name: 'CriarUsuario',
  data() {
    return {
      data: {
        name: '',
        email: '',
        role: '',
        password: '',
      },
      createError: false,
    }
  },
  methods: {
    createUser() {
      if (this.inputsFilled()) {
        api
          .post('/users', this.data)
          .then(() => {
            this.$router.push({ name: 'Usuarios' })
          })
          .catch(() => {})
      } else {
        this.createError = true
      }
    },
    inputsFilled() {
      if (this.data.name == '') {
        return false
      }
      if (this.data.email == '') {
        return false
      }
      if (this.data.role == '') {
        return false
      }
      if (this.data.password == '') {
        return false
      }
      return true
    },
  },
}
</script>
<style>
.botao_footer {
  padding-top: 10px;
  padding-bottom: 10px;
  justify-content: end;
}
</style>
