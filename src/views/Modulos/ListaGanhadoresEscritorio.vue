<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner"></div>
  </div>

  <div class="relatorio-content">
    <CCard class="mb-5">
      <CCardBody class="m-auto">
        <h4>Ganhadores Enviados ao Escritório</h4>
      </CCardBody>
    </CCard>
    <CRow>
      <CCol>
        <CCard disabled>
          <CCardHeader>
            <div class="header_align">
              <CForm
                class="row mt-5 d-flex justify-content-between align-items-center"
              >
                <div class="col-auto mb-3">
                  <p>Selecione a(s) bancas</p>
                  <v-select
                    :disabled="readOnly"
                    v-model="partnerSelected"
                    :items="partners"
                    item-title="name"
                    item-value="id"
                    chips
                    multiple
                  ></v-select>
                </div>
                <div class="col-auto mb-3">
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
                <div class="col-auto d-flex align-items-center">
                  <CButton
                    type="submit"
                    @click="listWinners()"
                    color="success"
                    class="same-height-button"
                  >
                    Consultar
                  </CButton>
                </div>
              </CForm>
            </div>
          </CCardHeader>
          <CCardBody v-if="tableVisible">
            <table class="table">
              <thead>
                <tr>
                  <th scope="col" width="20%">ID</th>
                  <th scope="col" width="20%">Banca</th>
                  <th scope="col" width="20%">Jogadores Adicionados</th>
                  <th scope="col" width="20%">Prêmio Adicionado</th>
                  <th scope="col" width="20%">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in winners" v-bind:key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.partner_name }}</td>
                  <td>{{ item.fake_winners }}</td>
                  <td>{{ item.fake_premio }}</td>
                  <td>
                    <CButton
                      @click="
                        copyToClipboard(
                          item.banca_id,
                          item.sort_date,
                          item.partner_name,
                        )
                      "
                      class="mr-2"
                      color="success"
                      >Copiar</CButton
                    >
                  </td>
                </tr>
              </tbody>
            </table>
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
      partnerSelected: [],
      partnerSelectedId: [],
      partnerSelectedName: null,
      number: '',
      premio: '',
      tableVisible: false,
      loading: false,
      modalVisible: false,
      modalDisabled: false,
      modalGanhadores: false,
      totalValorLiquido: '',
      totalPagBonus: '',
      partnerName: '',
      totalPagPremios: '',
      totalRecargaManual: '',
      totalPix: '',
      ganhadores: '',
      date: '',
      winners: [],
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
    openModalGanhadores() {
      this.modalGanhadores = true
    },
    listWinners() {
      /* eslint-disable */

      this.loading = true
      api
        .get(`/partners/winners-lists?sort_date=${this.date}&partner=${this.partnerSelected}`)
        .then((response) => {
          const data = response.data
          this.winners = data

          // Tornar a tabela visível
          this.tableVisible = true
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false
        })
    },
    formatTableContent2(winners, partnerName) {
    const totalGeral = winners.reduce((total, winner) => {
        console.log(winner.premio)
        let valorNumerico = parseFloat(winner.premio.replace(',', '.'));

        return total + valorNumerico;
    }, 0);

    const totalTickets = winners.reduce((total, winner) => {
        return total + parseFloat(winner.num_tickets);
    }, 0);

    let formattedContent = `🤑 ${partnerName} 🤑\n`;
    formattedContent += `SORTEIOS DO DIA: ${winners[0].sort_date}\n`;
    formattedContent += `PREMIAÇÕES GERAIS: R$ ${totalGeral.toLocaleString('pt-BR')}\n`;
    formattedContent += `TOTAL DE BILHETES: ${totalTickets}\n\n`;

    const groupedByGame = {};

    winners.forEach((winner) => {
        if (!groupedByGame[winner.game_name]) {
            groupedByGame[winner.game_name] = [];
        }
        groupedByGame[winner.game_name].push(winner);
    });

    Object.keys(groupedByGame).forEach((gameName) => {
        formattedContent += `🟡 ${gameName}\n`;

        groupedByGame[gameName].forEach((winner) => {
            formattedContent += `✔️ ${winner.name}, ${winner.num_tickets} cupons\n`;
            formattedContent += `💰 Prêmio: ${winner.premio_formatted}\n\n`;
        });
    });

    return formattedContent;
    },
    copyToClipboard(bancaId, sortDate, partnerName) {
    api
      .get(`/winners-list?partner=${bancaId}&sort_date=${sortDate}`)
      .then(response => {
        const data = response.data;

        const tableContent = this.formatTableContent2(data, partnerName);

        if (tableContent) {
          const tempTextArea = document.createElement('textarea');
          tempTextArea.value = tableContent;

          document.body.appendChild(tempTextArea);

          tempTextArea.select();
          document.execCommand('copy');

          document.body.removeChild(tempTextArea);

          alert('Conteúdo copiado para a área de transferência!');
        } else {
          console.error('Conteúdo da tabela não encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados:', error);
      });
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
