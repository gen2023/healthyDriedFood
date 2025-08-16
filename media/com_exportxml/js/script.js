jQuery(document).ready(function ($) {
  function searchCategories(inputSelector, resultSelector, task) {
    $(inputSelector).on('keyup', function () {
      const controller = $('input[name="controller"]').val();
      const search = $(this).val();
      const resultBox = $(resultSelector);
      const ajaxUrl = 'index.php?option=com_exportxml&controller=' + controller + '&task=' + task + '&search=';

      if (search.length > 0) {
        $.ajax({
          url: ajaxUrl + encodeURIComponent(search),
          dataType: 'json',
          success: function (data) {
            resultBox.empty().addClass('active');

            $.each(data.data, function (index, value) {
              if (value.category_id) {
                resultBox.append('<li class="dropdown-item" data-id="' + value.category_id + '">' + value.name + '</li>');
              } else if (value.product_id) {
                resultBox.append('<li class="dropdown-item" data-id="' + value.product_id + '">' + value.name + '</li>');
              } else {
                resultBox.append('<li class="dropdown-item" data-id="' + value.google_base_category_id + '">' + value.name + '</li>');
              }
            });
          },
        });
      } else {
        resultBox.removeClass('active');
      }
    });
  }

  searchCategories('#input-google-category', '#resultGoogle', 'getGoogleCategories');
  searchCategories('#input-google-category2', '#resultGoogle2', 'getGoogleCategories');
  searchCategories('#input-category', '#resultJs', 'getJoomShoppingCategories');
  searchCategories('#input-product', '#resultJs2', 'getJoomShoppingProduct');
  searchCategories('#input-product_exclude', '#resultJsExcludeProduct', 'getJoomShoppingProduct');
  searchCategories('#input-category_exclude', '#resultJsExclude', 'getJoomShoppingCategories');
  searchCategories('#input-category_binding', '#resultJsBinding', 'getJoomShoppingCategories');
  searchCategories('#input-product_binding', '#resultJsBindingProduct', 'getJoomShoppingProduct');

  $(document).on('click', '.dropdown-item', function () {
    const parentDiv = $(this).closest('.form-group');
    const input = parentDiv.find('input[type="text"]');
    const hiddenInput = parentDiv.find('input[type="hidden"]');
    const categoryId = $(this).data('id');

    if (categoryId !== undefined && categoryId !== '') {
      input.val($(this).text());
      hiddenInput.val(categoryId);
    } else {
      console.error("Ошибка: data-id у элемента не найден.");
    }

    $(this).parent().removeClass('active');
  });

  $('#button-category-add').on('click', function () {
    const googleCategoryId = $('input[name="google_base_category_id"]').val();
    const shopCategoryId = $('input[name="category_id"]').val();
    const googleCategory = $('#input-google-category').val();
    const shopCategory = $('#input-category').val();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addBindingMapping';

    if (googleCategoryId && shopCategoryId) {
      sendAjaxAndAddRow(
        url,
        { google_base_category_id: googleCategoryId, category_id: shopCategoryId },
        'delete-binding',
        [googleCategory, shopCategory, ''],
        'binding_list',
        'selectCategory'
      );
    }
  });

  $('#button-product-add').on('click', function () {
    const googleCategoryId = $('input[name="google_base_category_id2"]').val();
    const shopProductId = $('input[name="product_id"]').val();
    const googleCategory = $('#input-google-category2').val();
    const shopProduct = $('#input-product').val();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addBindingMapping';

    if (googleCategoryId && shopProductId) {
      sendAjaxAndAddRow(
        url,
        { google_base_category_id: googleCategoryId, product_id: shopProductId },
        'delete-binding',
        [googleCategory, '', shopProduct],
        'binding_list',
        'selectproduct'
      );

    }
  });

  $('#button-prod-in-cat-binding').on('click', function () {
    const shopCategoryId = $('input[name="binding_category_id"]').val();
    const shopProductId = $('input[name="binding_product_id"]').val();
    const shopCategory = $('#input-category_binding').val();
    const shopProduct = $('#input-product_binding').val();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addBindingMapping';

    if (shopCategoryId && shopProductId) {
      sendAjaxAndAddRow(
        url,
        { product_id: shopProductId, category_id: shopCategoryId },
        'delete-binding',
        [shopCategory, shopProduct],
        'binding_list',
        'selectCategoryBinding'
      );
    }
  });

  $('#button-category-add-exclude').on('click', function () {
    const shopCategoryId = $('input[name="exclude_category_id"]').val();
    const shopCategory = $('#input-category_exclude').val();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addCategoryProductExcludeMapping';

    if (shopCategoryId) {
      sendAjaxAndAddRow(
        url,
        { category_id: shopCategoryId },
        'delete-exclude',
        [shopCategory, ''],
        'exclude_category-list',
        'selectCategoryExclude'
      );
    }
  });

  $('#button-product-add-exclude').on('click', function () {
    const shopProductId = $('input[name="exclude_product_id"]').val();
    const shopProduct = $('#input-product_exclude').val();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addCategoryProductExcludeMapping';

    if (shopProductId) {

      sendAjaxAndAddRow(
        url,
        { product_id: shopProductId },
        'delete-exclude',
        ['', shopProduct],
        'exclude_category-list',
        'selectProductExclude'
      );
    }
  });

  $('#button-params-add').on('click', function () {
    const productParams = $('#extra_fields_params').val();
    const extra_fields_name = $('#extra_fields_params').find('option:selected').text();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addParamsProductMapping';

    if (productParams != '00') {
      sendAjaxAndAddRow(
        url,
        { params: productParams },
        'delete-params',
        [extra_fields_name],
        'params_list',
        'extra_fields_block'
      );

    }
  });

  $('#button-googleparams-add').on('click', function () {
    const productParams = $('#extra_fields_params').val();
    const googleParam = $('#google_param').val() ?? '';
    const extra_fields_name = $('#extra_fields_params').find('option:selected').text();
    const google_param_name = $('#google_param').find('option:selected').text();
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=addParamsProductMapping';

    if (productParams != '00') {
      sendAjaxAndAddRow(
        url,
        { params: productParams, google_param: googleParam },
        'delete-params',
        [google_param_name, extra_fields_name],
        'params_list',
        'extra_fields_block'
      );

    }
  });

  function sendAjaxAndAddRow(url, data, btnDelete, columns, tbody, block) {
    const loader = $('#' + block + ' .preloader');

    loader.show();
    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          let rowData = columns.map(col => `<td class="text-left">${col}</td>`).join('');

          newRow = `
              <tr class="table-row" data-id="${response.insert_id}">
                ${rowData}
                <td class="text-right">
                  <button type="button" class="btn btn-danger btn-sm ${btnDelete}">
                    <i class="fa fa-trash"></i>
                  </button>
                </td>
              </tr>
            `;
          $('#' + tbody).append(newRow);
          $('#' + tbody + ' .notEl').hide();
          $('#' + block + ' input').val('');
          $('#' + block + ' select').val('');
          showJoomlaMessage(response.messageSuccess, 'success');

        } else {
          showJoomlaMessage('Ошибка при удалении.', 'error');
        }
      },
      error: function () {
        showJoomlaMessage('Произошла ошибка при запросе к серверу.', 'error');
      },
      complete: function () {
        loader.hide();
      }
    });
  }

  $(document).on('click', '.delete-binding', function () {
    const row = $(this).closest('tr');

    deleteById(row, 'binding_list', 'deleteBindingMapping', 'binding_category');

  });

  $(document).on('click', '.delete-exclude', function () {
    const row = $(this).closest('tr');

    deleteById(row, 'exclude_category-list', 'deleteExcludeMapping', 'exclude_category');

  });

  $(document).on('click', '.delete-params', function () {
    const row = $(this).closest('tr');

    deleteById(row, 'params_list', 'deleteParamsProductMapping', 'params_table');

  });

  function deleteById(row, tbodyId, task, block) {

    const mappingId = row.data('id');
    const controller = $('input[name="controller"]').val();
    const url = 'index.php?option=com_exportxml&controller=' + controller + '&task=' + task;
    const loader = $('#' + block + ' .preloader');

    loader.show();

    $.ajax({
      url: url,
      type: 'POST',
      data: { id: mappingId },
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          row.remove();

          if ($('#' + tbodyId + ' .table-row').length === 0) {
            $('#' + tbodyId + ' .notEl').show();
          }
          showJoomlaMessage(response.messageSuccess, 'success');
        } else {
          showJoomlaMessage('Ошибка при удалении.', 'error');
        }
      },
      error: function () {
        showJoomlaMessage('Произошла ошибка при запросе к серверу.', 'error');
      },
      complete: function () {
        loader.hide();
      }
    });
  }

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.blockSelect').length) {
      $('.result').removeClass('active');
    }
  });

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
});
