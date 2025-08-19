document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".group_actions-js");

  if (container) {


    const selectAction = document.querySelector('#action1');
    const inputAction = document.querySelector('#input-action1');

    selectAction.addEventListener('change', function () {
      inputAction.value = this.value;
    });

    const action2Buttons = document.querySelector('#action2');
    const inputAction2 = document.querySelector('#input-action2');

    action2Buttons.addEventListener('change', function () {
      inputAction2.value = this.value;
    });

    const type_priceButtons = document.querySelector('#type_price');
    const inputtype_price = document.querySelector('#input-type_price');

    type_priceButtons.addEventListener('change', function () {
      inputtype_price.value = this.value;
    });

    const btnApply = document.querySelector('.btnEditPrice');
    const inputNumber = document.getElementById('input-number');

    btnApply.addEventListener('click', function (e) {
      e.preventDefault();

      const action = inputAction.value;
      const action2 = inputAction2.value;
      const type_price = inputtype_price.value;
      const number = parseFloat(inputNumber.value);
      const contProduct = document.querySelector('#count_product_group_actions');

      if (!action) return alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_ACTION'));
      if (!action2) return alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_TYPE_ACTION'));
      if (isNaN(number)) return alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_SELECT_NUMBER'));
      if (!type_price) return alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_ACTION'));

      const countType = contProduct.value;

      if (countType === 'selected') {
        selected = Array.from(document.querySelectorAll('.product_list input[type="checkbox"]:checked'))
          .map(cb => cb.value);

        if (selected.length === 0) {
          return alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_NOT_SELECT_PRODUCT'));
        }
      } else {
        // Для "all", "all_published", "all_not_published" отправим спец-значение
        selected = countType;
      }

      fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=editPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          ids: selected,
          action,
          action2,
          type_price,
          number
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showJoomlaMessage(data.message, 'success');
            location.reload();
          } else {
            showJoomlaMessage(data.message_err, 'error');
          }
        })
        .catch(err => {
          // console.error('Ошибка запроса:', err);
          alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH'));
        });
    });

  }

  const mass_operation = document.querySelector('.mass_operation-js');
  if (mass_operation) {
    const btnMassOperation = document.querySelector('.btnMmassOperation');
    const contProduct = document.querySelector('#count_product');

    const selectMassOperation = document.querySelector('#mass_operation_type');
    const containerValue = document.querySelector('.mass_operation_value');
    const mass_action_mode = document.querySelector('#mass_action_mode');

    function updateInputField() {
      const val = selectMassOperation.value;
      const selectedOption = selectMassOperation.options[selectMassOperation.selectedIndex];
      const baseVal = selectedOption.dataset.setv || val;

      containerValue.innerHTML = '';

      if (val === 'product_manufacturer_id' || val === 'currency_id' || val == 'label_id' || val == 'category') {
        const functionMap = {
          'product_manufacturer_id': 'getManufacturers',
          'currency_id': 'getCurrencies',
          'label_id': 'getLabelProduct',
          'category': 'getCategories',
        };

        const function_name = functionMap[val];

        fetch(`index.php?option=com_jshopping&controller=sofonaquickedit&task=${function_name}&format=json`)
          .then(response => response.json())
          .then(data => {
            containerValue.innerHTML = data.html;

            const select = containerValue.querySelector('select');
            if (select) {
              select.name = 'mass_operation_value';
              select.id = 'input-mass_operation_value';
              select.classList.add('form-select');
            }
            mass_action_mode.value = 'replace';
            mass_action_mode.classList.remove('active');

          })
          .catch(() => {
            alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPLOAD_FAIL'));
          });
      } else if (baseVal === 'mass_operation_value') {
        mass_action_mode.classList.add('active');
        const input = document.createElement('input');
        input.type = 'text';
        input.name = 'mass_operation_value';
        input.id = 'input-mass_operation_value';
        input.className = 'form-control';
        containerValue.appendChild(input);

      } else {
        const input = document.createElement('input');
        input.type = 'number';
        input.name = 'mass_operation_value';
        input.id = 'input-mass_operation_value';
        input.className = 'form-control';
        containerValue.appendChild(input);
        mass_action_mode.value = 'replace';
        mass_action_mode.classList.remove('active');

      }
    }

    selectMassOperation.addEventListener('change', updateInputField);
    updateInputField();

    btnMassOperation.addEventListener('click', function (e) {
      e.preventDefault();

      let value;
      if (selectMassOperation.value === 'product_manufacturer_id') {
        const select = document.querySelector('#input-mass_operation_value');
        if (!select || !select.value) {
          return alert('Выберите значение для массовой операции');
        }
        value = select.value;
      } else {
        const input = document.querySelector('#input-mass_operation_value');
        if (!input || !input.value.trim()) {
          return alert('Введите значение для массовой операции');
        }
        value = input.value.trim();
      }

      const type = selectMassOperation.value;
      const countType = contProduct.value;
      const action_mode = mass_action_mode.value;

      if (!type) return alert('Выберите тип массовой операции');

      let ids = [];

      if (countType === 'selected') {
        ids = Array.from(document.querySelectorAll('.product_list input[type="checkbox"]:checked'))
          .map(cb => cb.value);

        if (ids.length === 0) {
          return alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_NOT_SELECT_PRODUCT'));
        }
      } else {
        // Для "all", "all_published", "all_not_published" отправим спец-значение
        ids = countType;
      }

      fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=massUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          ids: ids,
          type,
          value,
          action_mode
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            showJoomlaMessage(data.message, 'success');
            location.reload();
          } else {
            showJoomlaMessage(data.message_err, 'error');
          }
        })
        .catch(() => {
          alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH'));
        });
    });
  }

  const table = document.querySelector('.product_list-js');

  if (table) {
    let activeInputTd = null;

    document.addEventListener("click", function (e) {
      const clickedTd = e.target.closest("td[data-field]");

      if (!clickedTd || !table.contains(clickedTd)) {
        closeActiveInput();
        return;
      }

      if (clickedTd === activeInputTd) return;

      closeActiveInput();

      const field = clickedTd.dataset.field;
      const type = clickedTd.dataset.type;
      const productId = clickedTd.dataset.product_id;
      const span = clickedTd.querySelector("span");
      const value = span ? span.textContent.trim() : '';
      const functionName = clickedTd.dataset.function_name;

      let inputHtml = `<input type="${type}"
              class="form-control form-control-sm"
              data-product_id="${productId}"
              id="${productId}"
              data-field="${field}"
              value="${value}" />`;

      if (type === 'textarea') {
        inputHtml = `<textarea class="form-control form-control-sm"
                 data-product_id="${productId}"
                 id="${productId}"
                 data-field="${field}">${value}</textarea>`;
      }
      if (type === 'select') {
        clickedTd.innerHTML = `<div class="edit_field"><select class="form-control form-control-sm" disabled><option>${Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_LOADING')}...</option></select></div>`;

        if (field === 'category') {
          fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=getCategories&format=json&product_id=' + productId)
            .then(response => response.json())
            .then(data => {
              const selectHtml = data.html;
              console.log(selectHtml);

              clickedTd.innerHTML = `<div class="edit_field">${selectHtml}</div>`;

              const editableElement = clickedTd.querySelector('select');
              editableElement.focus();

              editableElement.addEventListener('blur', function () {
                const selectedOptions = Array.from(this.selectedOptions).map(opt => opt.value);
                const id = this.dataset.product_id;
                // const fieldName = this.dataset.field;

                const payload = {
                  id: id,
                  fields: {
                    category_id: selectedOptions
                  }
                };

                fetch(`index.php?option=com_jshopping&controller=sofonaquickedit&task=updateCategorys&format=json`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify(payload)
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      showJoomlaMessage(data.message, 'success');
                    } else {
                      showJoomlaMessage(data.message_err, 'error');
                    }

                  }
                  )
                  .catch(() => alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH')));

                closeActiveInput();
              });

              activeInputTd = clickedTd;
            });

          return; // чтобы не создавать select дважды
        }
        if (field === 'manufacturer' || field === 'currency' || field === 'label_product') {

          fetch(`index.php?option=com_jshopping&controller=sofonaquickedit&task=${functionName}&format=json&product_id=${productId}`)
            .then(response => response.json())
            .then(data => {
              const selectHtml = data.html;
              clickedTd.innerHTML = `<div class="edit_field">${selectHtml}</div>`;

              const editableElement = clickedTd.querySelector('select');
              editableElement.focus();

              editableElement.addEventListener('change', function () {
                const selectedOptions = this.value;
                const id = this.dataset.product_id;
                const fieldName = this.dataset.field;

                const payload = {
                  id: id,
                  fieldLog: fieldName,
                  newValueLog: selectedOptions,
                  fields: {
                    [fieldName]: selectedOptions
                  }
                };

                fetch(`index.php?option=com_jshopping&controller=sofonaquickedit&task=updateField&format=json`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                  },
                  body: JSON.stringify(payload)
                })
                  .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                      showJoomlaMessage(data.message, 'success');
                    } else {
                      showJoomlaMessage(data.message_err, 'error');
                    }
                  })
                  .catch(() => alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH')));

                closeActiveInput();
              });

              activeInputTd = clickedTd;
            });
          return; // чтобы не создавать select дважды

        }
      }
      if (type === 'modal') {
        if (field === 'product_addition_price') {
          return;
        }
      }

      clickedTd.innerHTML = `<div class="edit_field">${inputHtml}</div>`;

      const editableElement = clickedTd.querySelector('input, textarea, select');
      if (editableElement) {
        editableElement.focus();

        editableElement.addEventListener('blur', function () {
          const newValue = this.value;
          const id = this.dataset.product_id;
          const fieldName = this.dataset.field;

          const payload = {
            id: id,
            fieldLog: fieldName,
            newValueLog: newValue,
            fields: {
              [fieldName]: newValue
            }
          };

          if (id && fieldName) {
            fetch(`index.php?option=com_jshopping&controller=sofonaquickedit&task=updateField&format=json`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
              },
              body: JSON.stringify(payload)
            })
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  showJoomlaMessage(data.message, 'success');
                } else {
                  showJoomlaMessage(data.message_err, 'error');
                }
              })
              .catch(() => alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH')));
          }

          closeActiveInput();
        });
      }

      activeInputTd = clickedTd;
    });

    function closeActiveInput() {
      if (activeInputTd) {
        const editable = activeInputTd.querySelector("input, textarea, select");
        if (editable) {
          const newSpan = document.createElement("span");

          let value;
          if (editable.tagName === 'SELECT' && editable.multiple) {
            const selectedTexts = Array.from(editable.selectedOptions).map(opt =>
              opt.text.replace(/^[-\s]+/, '')
            );
            value = selectedTexts.join(', ');
          } else if (editable.tagName === 'SELECT') {
            value = editable.options[editable.selectedIndex]?.text.replace(/^[-\s]+/, '') || '';
          } else {
            value = editable.value;
          }

          newSpan.textContent = value;
          activeInputTd.innerHTML = '';
          activeInputTd.appendChild(newSpan);
        }

        activeInputTd = null;
      }
    }

  }

  const actionRestore = document.querySelectorAll('.actionRestore');
  if (actionRestore) {
    actionRestore.forEach(element => {
      element.addEventListener('click', function () {
        const id = this.dataset.id;

        if (!confirm('Восстановить эту операцию?')) return;

        fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=restoreChange&format=json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'id=' + encodeURIComponent(id)
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              showJoomlaMessage(data.message, 'success');
              location.reload();
            } else {
              alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR') + data.message);
            }
          })
          .catch(err => {
            // console.error(err);
            alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH'))

          });
      });
    });
  }
  const historyTab=document.querySelector('.history-tab');
  if(historyTab){
    const item=historyTab.querySelectorAll('.itemDate');
    item.forEach(element => {
      const span=element.querySelector('.spanDateTable');
      span.addEventListener('click',function(){
        element.classList.toggle('active');
        
      })
    });
  }

});

function editUnlimited(isChecked, productId) {
  const td = document.querySelector(`td[data-field="product_quantity"][data-product_id="${productId}"]`);
  if (!td) return;
  const originalQty = td.dataset.original_qty || 1;


  if (isChecked) {
    td.innerHTML = `-----`;
  } else {
    td.innerHTML = `<span>${parseFloat(originalQty)}</span>`;
  }

  const payload = {
    id: productId,
    fieldLog: "unlimited",
    newValueLog: isChecked ? 1 : 0,
    fields: {
      unlimited: isChecked ? 1 : 0,
      product_quantity: isChecked ? 1 : parseFloat(originalQty)
    }
  };


  fetch(`index.php?option=com_jshopping&controller=sofonaquickedit&task=updateField&format=json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showJoomlaMessage(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_UPDATE_UNLIMITED'), 'success');
      } else {
        showJoomlaMessage(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_UNLIMITED'), 'error');
      }

    })
    .catch(() => alert(Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH')));

}

function openModalAdditionPrice(productId, priceProduct) {
  const modalAdditionPrice = document.querySelector('.modalAdditionPrice');
  const closeModal = modalAdditionPrice.querySelector('.closeModal');
  const tableBody = modalAdditionPrice.querySelector('#table_add_price tbody');

  tableBody.innerHTML = '';

  const loadingRow = document.createElement('tr');
  loadingRow.id = 'loadingRow';
  loadingRow.innerHTML = `<td colspan="5" style="text-align:center;">${Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_LOADING')}...</td>`;
  tableBody.appendChild(loadingRow);

  // Открыть модалку
  modalAdditionPrice.classList.add('active');

  closeModal.addEventListener('click', function () {
    modalAdditionPrice.classList.remove('active');
    location.reload();
    const msg = document.getElementById('additionPriceErrorMsg');
    msg.textContent = '';
  });

  fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=getAdditionPrices&format=json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ product_id: productId })
  })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      const loading = modalAdditionPrice.querySelector('#loadingRow');
      if (loading) loading.remove();

      if (Array.isArray(data.data) && data.data.length > 0) {
        data.data.forEach((item, index) => {
          const discountPercent = parseFloat(item.discount);
          const discountedPrice = (item.product_price * (1 - discountPercent / 100)).toFixed(2);

          const row = document.createElement('tr');
          row.id = `add_price_${index}`;
          row.dataset.priceId = item.price_id;

          row.innerHTML = `
            <td>
              <input type="text" class="form-control small3" name="quantity_start[]" value="${item.product_quantity_start}" readonly>
            </td>
            <td>
              <input type="text" class="form-control small3" name="quantity_finish[]" value="${item.product_quantity_finish}" readonly>
            </td>
            <td>
              <input type="text" class="form-control small3" name="product_add_discount[]" value="${item.discount}" readonly>
            </td>
            <td>
              <input type="text" class="form-control small3" value="${discountedPrice}" readonly>
            </td>
            <td align="center">
              <a class="btn btn-danger btn-delete-price" href="javascript:void(0);">
                <i class="icon-delete"></i>
              </a>
            </td>
          `;

          tableBody.appendChild(row);

          row.querySelector('.btn-delete-price').addEventListener('click', function () {
            const priceId = row.dataset.priceId;

            if (!priceId || !confirm('Удалить эту цену?')) return;
            const msg = modalAdditionPrice.querySelector('#additionPriceErrorMsg');

            fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=deleteAdditionPrice&format=json', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
              },
              body: JSON.stringify({ id: priceId })
            })
              .then(res => res.json())
              .then(result => {

                if (result.success) {
                  row.remove();
                  if (msg) {
                    msg.textContent = result.message || 'Цена удалена успешно';
                  }
                } else {

                  if (msg) {
                    msg.textContent = result.message_err || 'Ошибка при удалении';
                  }

                }
              })
              .catch(err => {

                if (msg) {
                  msg.textContent = 'Ошибка при удалении';
                }

                console.error(err);
              });
          });

        });
      } else {
        tableBody.innerHTML = `<tr><td colspan="5">${Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_CONTENT_UNSET_PRODUCT_PRICE')}</td></tr>`;
      }
    })
    .catch(error => {
      const loading = document.getElementById('loadingRow');
      if (loading) loading.remove();

      console.error('Ошибка загрузки данных:', error);
    });

  //---------------------------------------------------
  window.currentProductId = productId;
  window.currentBasePrice = priceProduct;

  document.querySelector('input[name="add_new_price"]').addEventListener('click', function () {

    const tableBody = document.querySelector('#table_add_price tbody');
    const existingRow = tableBody.querySelector('#new_add_price_row');
    if (existingRow) {
      existingRow.remove();
    }
    let newRow = document.createElement('tr');


    newRow.id = 'new_add_price_row';

    newRow.innerHTML = `
    <td><input type="number" class="form-control small3" id="new_quantity_start" min="1"></td>
    <td><input type="number" class="form-control small3" id="new_quantity_finish" min="1"></td>
    <td><input type="number" class="form-control small3" id="new_discount" min="0" max="100" step="0.01"></td>
    <td><span id="new_calculated_price">-</span></td>
    <td>
      <a href="javascript:void(0);" class="btn btn-success" id="save_new_price">
        <i class="icon-save"></i>
      </a>
    </td>
  `;

    tableBody.appendChild(newRow);

    const discountInput = newRow.querySelector('#new_discount');
    discountInput.addEventListener('input', () => {
      const productPrice = window.currentBasePrice || 100;
      const discount = parseFloat(discountInput.value) || 0;
      const discountedPrice = (productPrice * (1 - discount / 100)).toFixed(2);
      newRow.querySelector('#new_calculated_price').textContent = discountedPrice;
    });

    newRow.querySelector('#save_new_price').addEventListener('click', function () {
      const productId = window.currentProductId;
      const quantityStart = parseInt(document.getElementById('new_quantity_start').value);
      const quantityFinish = parseInt(document.getElementById('new_quantity_finish').value);
      const discount = parseFloat(document.getElementById('new_discount').value);

      const msg = document.getElementById('additionPriceErrorMsg');
      msg.textContent = '';

      if (!productId || isNaN(quantityStart) || isNaN(quantityFinish) || isNaN(discount)) {
        msg.textContent = Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_ADDITION_PRICE_NOT_FIELD');
        return;
      }

      fetch('index.php?option=com_jshopping&controller=sofonaquickedit&task=addAdditionPrice&format=json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity_start: quantityStart,
          quantity_finish: quantityFinish,
          discount: discount
        })
      })
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            // Перезагрузить таблицу (оптимально – вызвать openModalAdditionPrice снова)
            openModalAdditionPrice(productId);
          } else {
            msg.textContent = result.error || 'Ошибка при добавлении цены';
          }
        })
        .catch(err => {
          msg.textContent = Joomla.Text._('PLG_JSHOPPINGADMIN_SOFONAQUICKEDIT_MSG_ERR_FETCH');
          console.error(err);
        });
    });
  });

}


function showJoomlaMessage(message, type = 'info') {
  const messageContainer = document.getElementById('system-message-container');
  if (!messageContainer) return;

  const messagesBox = document.createElement('joomla-alert');
  messagesBox.setAttribute('type', type);
  messagesBox.setAttribute('close-text', Joomla.Text._('JCLOSE'));
  messagesBox.setAttribute('dismiss', true);
  messagesBox.setAttribute('auto-dismiss', 10000);

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'alert-heading';
  titleWrapper.innerHTML = Joomla.sanitizeHtml(`<span class="success"></span><span class="visually-hidden">success</span>`);
  messagesBox.appendChild(titleWrapper);

  const messageWrapper = document.createElement('div');
  messageWrapper.className = 'alert-wrapper';
  messageWrapper.innerHTML += Joomla.sanitizeHtml(`<div class="alert-message">${message}</div>`);
  messagesBox.appendChild(messageWrapper);
  messageContainer.appendChild(messagesBox);
}

