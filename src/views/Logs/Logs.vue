<template>
  <div>
    <CRow>
      <CCol>
        <CCard>
          <CCardHeader>
            <div class="header_align">
              <div class="pt-2">Logs</div>
            </div>
          </CCardHeader>
          <CCardBody>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">Id do Log</th>
                  <th scope="col" width="10%">Id do Usuário</th>
                  <th scope="col" width="15%">Data da Ação</th>
                  <th scope="col" width="15%">Nome do Usuário</th>
                  <th scope="col" width="50%">Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in logs" v-bind:key="item.id">
                  <th>{{ item.id }}</th>
                  <td>{{ item.user_id }}</td>
                  <td>
                    {{
                      new Date(item.created_at)
                        .toLocaleString('pt-BR')
                        .replace(',', '')
                    }}
                  </td>
                  <th>{{ item.user_name }}</th>
                  <td>{{ item.action }}</td>
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
  name: 'Logs',
  data() {
    return {
      logs: [],
      pages: 1,
      activePage: 1,
    }
  },
  mounted() {
    this.listLogs()
  },
  methods: {
    listLogs() {
      api
        .get(`/logs?page=${this.activePage}`)
        .then((response) => {
          this.logs = response.data.data
          this.pages = response.data.last_page
        })
        .catch(() => {})
    },
  },
  watch: {
    activePage: function () {
      this.listLogs()
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
.alinhar_paginacao {
  justify-content: space-between;
}
.pagination_align {
  max-width: 60px;
  margin-left: 8px;
}
</style>
