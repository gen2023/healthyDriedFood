document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("clientSearch");

  if (searchInput) {
    const select = document.getElementById("client_id");
    const listBox = document.querySelector(".list_search_client-js");

    searchInput.addEventListener("input", function () {
      const filter = this.value.toLowerCase();
      listBox.innerHTML = "";
      listBox.style.display = "none";

      let matches = 0;
      for (let option of select.options) {
        if (option.value === "0") continue;
        if (option.text.toLowerCase().includes(filter)) {
          const item = document.createElement("div");
          item.textContent = option.text;
          item.dataset.value = option.value;

          item.addEventListener("click", function () {
            searchInput.value = this.textContent;
            select.value = this.dataset.value;
            listBox.style.display = "none";
          });

          listBox.appendChild(item);
          matches++;
        }
      }

      if (matches > 0) {
        listBox.style.display = "block";
      }
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".list_search_client-js") && e.target !== searchInput) {
        listBox.style.display = "none";
      }
    });
  }

  document.querySelectorAll('.exportXlsBtn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();

      const type = this.dataset.type;

      const client_id = document.querySelector('[name="client_id"]')?.value || '';
      const client_type = document.querySelector('[name="client_type"]')?.value || '';
      const status_id = document.querySelector('[name="status_id"]')?.value || '';
      const date_from = document.querySelector('[name="date_from"]')?.value || '';
      const date_to = document.querySelector('[name="date_to"]')?.value || '';
      const currency_id = document.querySelector('[name="currency_id"]')?.value || '';
      const category_id = document.querySelector('[name="category_id"]')?.value || '';
      const l_usergroup_id = document.querySelector('[name="l_usergroup_id"]')?.value || '';

      const params = new URLSearchParams();
      params.append('option', 'com_jshopping');
      params.append('controller', 'sofonareports');
      params.append('task', 'exportxls');
      params.append('type', type);
      params.append('client_id', client_id);
      params.append('client_type', client_type);
      params.append('status_id', status_id);
      params.append('date_from', date_from);
      params.append('date_to', date_to);
      params.append('currency_id', currency_id);
      params.append('category_id', category_id);
      params.append('l_usergroup_id', l_usergroup_id);

      const selectStatusOrder = document.querySelector('[name="statusOrder_id[]"]');
      let statusOrder_id = [];
      if (selectStatusOrder) {
        statusOrder_id = Array.from(selectStatusOrder.selectedOptions).map(opt => opt.value);
      }

      statusOrder_id.forEach(val => params.append('statusOrder_id[]', val));

      const url = `/administrator/index.php?${params.toString()}`;

      fetch(url, {
        method: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Ошибка сети');
          }
          return response.blob();
        })
        .then(blob => {
          const a = document.createElement('a');
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const currentDate = `${year}-${month}-${day}`;

          a.href = window.URL.createObjectURL(blob);
          a.download = `report_${type}_${currentDate}.xls`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(err => {
          console.error('Ошибка при экспорте:', err);
          alert('Произошла ошибка при экспорте');
        });
    });
  });


  const chartContainer = document.querySelector('.ordersChart-js');
  if (chartContainer) {

    const labels = JSON.parse(chartContainer.dataset.labels);
    const dataValues = JSON.parse(chartContainer.dataset.dates);
    const dataSums = JSON.parse(chartContainer.dataset.sums);

    const ctx = document.getElementById('ordersChart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_COUNT_ORDERS'),
            data: dataValues,
            borderColor: 'blue',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            yAxisID: 'y'
          },
          {
            label: Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_SUMM_ORDERS'),
            data: dataSums,
            borderColor: 'green',
            backgroundColor: 'rgba(75, 192, 75, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.3,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_COUNT') }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            title: { display: true, text: Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAREPORTS_CHART_LABEL_SUMM_ORDERS') },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });

  }

  const divDisplay = document.getElementById('statusOrder');
  const selectEl = document.getElementById('statusOrder_id');

  if (divDisplay && selectEl) {
    function updateDivWithSelected() {
      const selectedOptions = Array.from(selectEl.selectedOptions)
        .filter(opt => opt.value !== '0');

      divDisplay.innerHTML = '';

      if (selectedOptions.length === 0) {
        divDisplay.textContent = Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAREPORTS_MULTIPLE_SELECT_STATUS_ORDER');
      } else {
        selectedOptions.forEach(opt => {
          const span = document.createElement('span');
          span.textContent = opt.text;
          span.style.cssText = `
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 2px 8px;
          margin: 2px 4px 2px 0;
          border-radius: 4px;
          font-size: 0.9em;
        `;
          divDisplay.appendChild(span);
        });
      }
    }

    updateDivWithSelected();

    divDisplay.addEventListener('click', () => {
      selectEl.classList.toggle('active');
    });

    selectEl.addEventListener('change', () => {
      updateDivWithSelected();
    });

    document.addEventListener('click', (e) => {
      if (!divDisplay.contains(e.target) && !selectEl.contains(e.target)) {
        selectEl.classList.remove('active');
      }
    });
  }
});
