<!-- eslint-disable -->
<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
  <CModal :visible="modalVisible" size="lg">
    <CModalHeader>
      <CModalTitle>Enviar ao Escritório</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th scope="col" width="10%"></th>
              <th scope="col" width="10%">ID</th>
              <th scope="col" width="20%">Nome do Usuário</th>
              <th scope="col" width="20%">Prêmio</th>
              <th scope="col" width="20%">Bilhetes</th>
              <th scope="col" width="20%">Modalidade</th>
              <th scope="col" width="20%">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in winners3" v-bind:key="item.id">
              <td>
                <input type="checkbox" v-model="item.checked" />
                <!-- <input type="checkbox" id="{checkbox}" v-model="checked" /> -->
              </td>
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
      <CButton
        :disabled="modalDisabled"
        color="success"
        @click="removeSelectedItems"
        >Confirmar
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
                    v-model.lazy="partnerSelected"
                    @change="handlePartnerChange"
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
                  <!-- Novo select -->
                  <div class="col-auto" v-if="partnerSelected.length > 0">
                    <CFormSelect
                      aria-label="Default select example"
                      v-model="type_game"
                    >
                      <option value="">Selecione uma modalidade</option>
                      <option
                        v-for="item in modalidades"
                        :key="item.id"
                        :value="item.id"
                      >
                        {{ item.name }}
                      </option>
                    </CFormSelect>
                    <CButton
                      type="trash"
                      @click="limparModalidade()"
                      color="danger"
                      class="mb-3"
                      >Limpar</CButton
                    >
                  </div>
                  <!-- <div class="col-auto" v-if="partnerSelectedName == 'SuperLotogiro'">
                    <CFormSelect
                      aria-label="Default select example"
                      v-model="groupgame"
                    >
                      <option value="">Todas as Loterias</option>
                      <option value="loteria_brasileira">Loteria Brasileira</option>
                      <option value="loteria_chile">Loteria Chile</option>
                      <option value="loteria_mexico">Loteria Mexico</option>
                      <option value="loteria_santa_lucia">Loteria Santa Lucia</option>
                      <option value="loteria_polonia">Loteria Polonia</option>
                      <option value="loteria_reino_unido">Loteria Reino Unido</option>
                    </CFormSelect>
                    <CButton
                      type="trash"
                      @click="limparModalidade()"
                      color="danger"
                      class="mb-3"
                      >Limpar</CButton
                    >
                  </div> -->
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
                  <th scope="col" width="20%">Banca</th>
                  <th scope="col" width="20%">Modalidade</th>
                  <th scope="col" width="20%">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners2" v-bind:key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.premio_formatted }}</td>
                  <td>{{ item.num_tickets }}</td>
                  <td>{{ item.banca }}</td>
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

                    <CBadge
                      v-if="item.status == 4"
                      color="primary"
                      shape="rounded-pill"
                      >Auto</CBadge
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
                @click="removeSelectedItems"
                id="enviarAoEscritorio"
              >
                Enviar ao Escritório 1
              </CButton>
              <CButton
                v-show="tableVisible"
                class="send-button btn btn-success btn-lg"
                color="danger"
                @click="openModal"
                id="removerItens"
              >
                Remover Itens
              </CButton>
            </div>
          </CCardBody>
          <CCardBody v-if="tableVisible2">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="10%">ID</th>
                  <th scope="col" width="20%">Nome do Usuário</th>
                  <th scope="col" width="20%">Prêmio</th>
                  <th scope="col" width="20%">Bilhetes</th>
                  <th scope="col" width="20%">Banca</th>
                  <th scope="col" width="20%">Modalidade</th>
                  <th scope="col" width="20%">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners2" v-bind:key="item.id">
                  <th scope="row">{{ item.id }}</th>
                  <td>{{ item.name }}</td>
                  <td>{{ item.premio_formatted }}</td>
                  <td>{{ item.num_tickets }}</td>
                  <td>{{ item.banca }}</td>
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
                v-show="tableVisible2"
                class="copy-button btn btn-primary btn-lg"
                color="primary"
                @click="copyToClipboard"
                id="botaoCopiarListaGanhadores"
              >
                Copiar Lista Ganhadores
              </CButton>
              <CButton
                v-show="tableVisible2"
                class="send-button btn btn-success btn-lg"
                color="success"
                @click="removeSelectedItems2"
                id="enviarAoEscritorio"
              >
                Enviar ao Escritório 2
              </CButton>
              <CButton
                v-show="tableVisible2"
                class="send-button btn btn-success btn-lg"
                color="danger"
                @click="openModal"
                id="removerItens"
              >
                Remover Itens
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
      modalidades: [],
      listaBase: [],
      partnerSelected: [],
      partnerSelectedId: null,
      partnerSelectedName: null,
      groupgame: '',
      number: '',
      premio: 0,
      type_game: '',
      date: '',
      winners1: [],
      winners2: [],
      winners3: [],
      listazerada: false,
      tableVisible: false,
      tableVisible2: false,
      modalVisible: false,
      modalDisabled: false,
      loading: false,
      modalGanhadores: false,
      ganhadores: 0,
      checked: '',
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
    loadModalidades() {
      // Verifica se um parceiro foi selecionado
      if (this.partnerSelected.length > 0) {
        // Obtém o ID do parceiro selecionado
        const parts = this.partnerSelected.split(',')

        if (parts.length > 2) {
          this.partnerSelectedId = this.partnerSelected
          this.partnerSelectedName = 'Todas Modalidades'

          this.modalidades = [
            {
              name: 'Loteria Brasil',
              id: 'BRASIL',
              connection: 'all',
            },
            {
              name: 'Loteria Chile',
              id: 'CHILE',
              connection: 'all',
            },
            {
              name: 'Loteria Santa Lúcia',
              id: 'SANTA LUCIA',
              connection: 'all',
            },
            {
              name: 'Loteria México',
              id: 'MÉXICO',
              connection: 'all',
            },
            {
              name: 'Loteria Polônia',
              id: 'POLONIA',
              connection: 'all',
            },
            {
              name: 'Loteria Reino Unido',
              id: 'REINO UNIDO',
              connection: 'all',
            },
          ]
        } else {
          this.partnerSelectedId = parts[0]
          this.partnerSelectedName = parts[1]

          // Faça uma chamada para carregar as modalidades correspondentes ao parceiro selecionado
          api
            .get(`/partners/modalidades/${this.partnerSelectedId}`)
            .then((response) => {
              // Atualize as modalidades com os dados retornados pela API
              this.modalidades = response.data
            })
            .catch((error) => {
              console.error('Erro ao carregar as modalidades:', error)
            })
        }
      } else {
        // Limpa as modalidades se nenhum parceiro estiver selecionado
        this.modalidades = []
      }
    },
    handlePartnerChange() {
      // Utiliza nextTick para garantir que o código seja executado após a atualização do modelo
      this.$nextTick(() => {
        const partnerId = this.partnerSelected[0]
        const partnerName = this.partnerSelected[1]
        this.type_game = ''
        this.modalidades = []

        this.partnerSelectedId = partnerId
        this.partnerSelectedName = partnerName

        console.log('ID da Banca selecionada:', this.partnerSelectedId)
        this.loadModalidades()
      })
    },
    formatTableContent() {
      /* eslint-disable */
      const totalGeral = this.winners2.reduce((total, winner) => {
        let valorNumerico

        if (typeof winner.premio === 'string') {
          valorNumerico = parseFloat(winner.premio.replace(/\./g, '').replace(',', '.'))
        } else {
          valorNumerico = winner.premio
        }

        return total + valorNumerico
      }, 0)

      const totalTickets = this.winners2.reduce((total, winner) => {
        return total + parseFloat(winner.num_tickets)
      }, 0)

      // Agrupar os ganhadores pelo nome do jogo
      var groupedByGame = {}
      var groupedGameNames = []
      this.winners2.forEach((winner) => {
        if (!groupedByGame[winner.categoria]) {
          groupedByGame[winner.categoria] = []
        }

        groupedByGame[winner.categoria].push(winner)

        if(groupedGameNames.indexOf(winner.categoria) == -1) {
          groupedGameNames[winner.categoria] = {}
        }

        groupedGameNames[winner.categoria]['game_name'] = winner.game_name
        groupedGameNames[winner.categoria]['category'] = winner.categoria
      })

      groupedByGame = Object.fromEntries(
        Object.entries(groupedByGame).sort(([a], [b]) => a.localeCompare(b))
      );

      var sel = this.partnerSelected.split(',');
      var banca = sel[((sel.length) - 1)]

      let formattedContent = `🤑 ${banca} ${banca.trim() == 'Todas Bancas' || banca.trim() == 'Todas Modalidades' ? this.type_game : ''}🤑\n`
      formattedContent += `SORTEIOS DO DIA: ${this.winners2[0].sort_date}\n`
      formattedContent += `PREMIAÇÕES GERAIS: ${totalGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n`
      formattedContent += `TOTAL DE BILHETES: ${totalTickets}\n`

      console.log(groupedGameNames.loto_facil)

      Object.keys(groupedByGame).forEach((gameName) => {
        var title_game = groupedGameNames[gameName].game_name;
        if (title_game.indexOf('-') > -1) {
          title_game = title_game.split('-').slice(1).join('-')?.trim()?.toUpperCase();
        }

        formattedContent += `\n🟡 ${title_game}\n`

        let totalPrizeByGame = 0; // Inicializar totalPrizeByGame para cada grupo de ganhadores

        groupedByGame[gameName].forEach((winner) => {
          formattedContent += `✔️ ${winner.name}, ${winner.num_tickets} ${winner.num_tickets == 1 ? 'cupom' : 'cupons'}\n`
          formattedContent += `💰 Prêmio: ${winner.premio_formatted}\n`
          // formattedContent += `🏦 Banca: ${winner.banca}\n`
          formattedContent += `\n`

          let valorNumerico

          if (typeof winner.premio === 'string') {
            valorNumerico = parseFloat(winner.premio.replace(/\./g, '').replace(',', '.'))
          } else {
            valorNumerico = winner.premio
          }

          totalPrizeByGame += valorNumerico;
        })

        // formattedContent += `\nTotal de Prêmios 💰 ${totalPrizeByGame.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 💰\n`
      })

      return formattedContent
    },
    openModal() {
      this.loading = false;
      this.modalVisible = true
    },
    closeModal() {
      this.modalVisible = false
    },
    removeSelectedItems() {
      //Só remove os itens
      this.tableVisible = false;

      // Filtra os itens marcados na lista winners1 e armazena os IDs dos itens marcados
      const selectedIds = this.winners3.filter((item) => item.checked).map((item) => item.id)

      this.winners1 = this.winners2
      // Remove os itens correspondentes da lista winners1 com base nos IDs selecionados
      this.winners1 = this.winners1.filter((item) => !selectedIds.includes(item.id))

      // Remove os itens correspondentes da lista winners2 com base nos IDs selecionados
      this.winners2 = this.winners2.filter((item) => !selectedIds.includes(item.id))
      if (this.winners2.length === 0 && this.winners1.length === 0){
        this.listazerada = true
      }

      this.modalVisible = false
      this.tableVisible2 = true
    },
    removeSelectedItems2() {
      //Envia itens
      const requestData = {
        banca_id: this.partnerSelectedId,
        fakes: this.ganhadores,
        premio: this.premio,
        winners2: this.winners2,
        sort_date: this.date,
      };
      // Enviar a solicitação para a rota Laravel
      api.post('/partners/winners-lists', requestData)
          .then(response => {
          })
          .catch(() => {})
          .finally(() => {
            this.modalVisible = false
            alert('Lista enviada ao escritório com sucesso')
      });

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
    limparModalidade() {
      this.type_game = ''
      this.groupgame = ''
      console.log('Após limpar modalidade: ', this.type_game)
      console.log('Após limpar modalidade: ', this.groupgame)

    },
    listWinners() {
      this.winners1 = [],

      this.loading = true;
      const parts = this.partnerSelected.split(',')

      if( this.partnerSelected.length > 2 ) {
        this.partnerSelectedId = this.partnerSelected
        this.partnerSelectedName = 'Todas Modalidades'
      } else{
        this.partnerSelectedId = parts[0]
        this.partnerSelectedName = parts[1]
      }

      this.tableVisible2 = false
      api
        .get(
          `/partners/get-result?partner=${this.partnerSelectedId}&number=${this.date}&groupgame=${this.groupgame}&modalidade=${this.type_game}`,
        )
        .then((response) => {
          this.winners2 = response.data
          this.winners3 = response.data
          this.tableVisible = true
        })
        .catch(() => {})
        .finally(() => {
            this.loading = false;
        });
    },
    listFakeWinners() {
      this.tableVisible2 = false;
      this.loading = true;
      const parts = this.partnerSelected.split(',');

      this.partnerSelectedId = parts[0];
      this.partnerSelectedName = parts[1];

      const requestData = {
        fakes: this.ganhadores,
        premio: this.premio,
        winners2: this.winners2,
        winners3: this.winners3,
        partners: this.partnerSelected,
        modalidades: this.modalidades
      };

      // Verifica se há itens na lista winners1
      if (this.winners1.length === 0 && this.listazerada == false) {
        api
          .post(
            `/partners/get-result3?&groupgame=${this.groupgame}`, requestData
          )
          .then((response) => {
            this.winners2 = response.data;
            this.tableVisible = true;
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
      } else {
        // Se a lista não estiver vazia, envia os dados da lista para a rota Laravel correspondente
        api
          .post(
            `/partners/get-result3?&groupgame=${this.groupgame}`, requestData
          )
          .then((response) => {
            this.winners2 = response.data; // Atualiza winners3 com a resposta da API
            this.tableVisible = true;
          })
          .catch(() => {})
          .finally(() => {
            this.loading = false;
          });
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
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Transparência para criar o efeito de fade */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Z-index alto para ficar na frente de outros elementos */
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3); /* Cor e espessura da borda do spinner */
  border-radius: 50%; /* Forma do spinner */
  border-top: 4px solid #ffffff; /* Cor e espessura da borda superior do spinner */
  width: 50px; /* Largura do spinner */
  height: 50px; /* Altura do spinner */
  animation: spin 1s linear infinite; /* Animação de rotação */
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); } /* Rotação inicial */
  100% { transform: rotate(360deg); } /* Rotação completa */
}
</style>
