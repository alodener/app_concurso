<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="5">
          <CAlert v-if="loginError" class="text-center" color="danger"
            >Dados Inválidos!</CAlert
          >
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Faça login em sua conta</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autocomplete="username"
                      v-model="data.email"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      v-model="data.password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" @click="login()">
                        Login
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import api from '@/plugins/axios'
export default {
  name: 'Login',
  data() {
    return {
      data: { email: '', password: '' },
      loginError: false,
    }
  },
  mounted() {},
  methods: {
    login() {
      api
        .post('/auth/login', this.data)
        .then((response) => {
          if (response.data.access_token) {
            localStorage.setItem('jwt', response.data.access_token)
            localStorage.setItem('user', JSON.stringify(response.data.user))
            this.$router.push({ name: 'Dashboard' })
          }
        })
        .catch(() => {
          this.loginError = true
        })
    },
  },
}
</script>
