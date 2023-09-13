<template>
  <CModal :visible="modalVisible">
    <CModalHeader>
      <CModalTitle>Deseja Excluir o Usuário?</CModalTitle>
    </CModalHeader>
    <CModalFooter>
      <CButton color="danger" @click="deleteUser()">Excluir</CButton>
    </CModalFooter>
  </CModal>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div class="header_align">
              <div class="pt-2"><strong>Usuários</strong></div>
              <div>
                <CButton
                  color="primary"
                  class="text_button"
                  @click="redirectCreateUser()"
                >
                  <CIcon name="cil-user-follow" />
                  Novo Usuario
                </CButton>
              </div>
            </div>
          </CCardHeader>
          <CCardBody>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="15%">id</th>
                  <th scope="col" width="20%">Nome</th>
                  <th scope="col" width="25%">E-mail</th>
                  <th scope="col" width="15%">Permissão</th>
                  <th scope="col" width="25%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in users" v-bind:key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ tratarRole(item.role) }}</td>
                  <td class="m-left">
                    <div class="d-flex">
                      <CButton
                        v-if="item.role != 'super_admin'"
                        class="align_bottom"
                        variant="outline"
                        color="warning"
                        @click="
                          this.$router.push({
                            name: 'EditarUsuario',
                            params: { id: item.id },
                          })
                        "
                      >
                        <CIcon name="cil-pencil" />
                        Editar
                      </CButton>
                      <CButton
                        v-if="item.role != 'super_admin'"
                        class=""
                        variant="outline"
                        color="danger"
                        @click="openModal(item.id)"
                      >
                        <CIcon name="cilXCircle" />
                        Excluir
                      </CButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </CCardBody>
          <CCardFooter>
            <div class="d-flex alinhar_paginacao mt-1 mb-1">
              <div>
                <div class="d-flex">
                  <strong class="mt-2">Pagina:</strong>
                  <CFormInput
                    v-model="activePage"
                    type="text"
                    class="pagination_align"
                  />
                </div>
              </div>
              <div class="mt-2">
                <strong>Total de Paginas: {{ this.pages }}</strong>
              </div>
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
  name: 'Usuarios',
  data() {
    return {
      users: [],
      modalVisible: false,
      userDeleteId: null,
      pages: 1,
      activePage: 1,
    }
  },
  mounted() {
    this.listUsers()
  },
  methods: {
    listUsers() {
      api
        .get(`/users?page=${this.activePage}`)
        .then((response) => {
          this.users = response.data.data
          this.pages = response.data.last_page
        })
        .catch(() => {})
    },
    deleteUser() {
      api
        .delete(`/users/${this.userDeleteId}`)
        .then(() => {
          window.location.reload()
        })
        .catch(() => {})
    },
    openModal(id) {
      this.modalVisible = true
      this.userDeleteId = id
    },
    redirectCreateUser() {
      this.$router.push({ name: 'CriarUsuario' })
    },
    tratarRole(role) {
      switch (role) {
        case 'super_admin':
          return 'Super Admin'
        case 'admin':
          return 'Admin'
        case 'gestor_resultado':
          return 'Gestor de Resultado'
        case 'gerente_jogo':
          return 'Gerente de Jogos'
        case 'marketing':
          return 'Marketing'
        default:
          return 'Não Cadastrado'
      }
    },
  },
  watch: {
    activePage: function () {
      this.listUsers()
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
