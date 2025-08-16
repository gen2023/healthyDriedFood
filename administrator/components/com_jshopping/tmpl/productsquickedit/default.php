<?php
use Joomla\CMS\Language\Text;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Component\Jshopping\Site\Helper\Helper;
use Joomla\CMS\Uri\Uri;
use Joomla\CMS\Session\Session;

//administrator/index.php?option=com_jshopping&controller=productsquickedit

/**
 * @version      5.3.4 15.09.2018
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
defined('_JEXEC') or die();

$rows = $this->rows;
$lists = $this->lists;
$pageNav = $this->pagination;
$text_search = $this->text_search;
$category_id = $this->category_id;
// $manufacturer_id=$this->manufacturer_id;
$count = count($rows);
$i = 0;
$saveOrder = ($this->filter_order_Dir == "asc" && $this->filter_order == "ordering" && $category_id);
if ($saveOrder) {
    $saveOrderingUrl = 'index.php?option=com_jshopping&controller=productsquickedit&task=saveorder&category_id=' . $category_id . '&tmpl=component&ajax=1';
    Joomla\CMS\HTML\HTMLHelper::_('draggablelist.draggable');
}
?>
<div id="j-main-container" class="j-main-container">
    <form action="index.php?option=com_jshopping&controller=productsquickedit&view=productsquickedit" method="post" name="adminForm" id="adminForm">
        <?php print $this->tmp_html_start ?>

        <div class="js-filters">
            <?php print $this->tmp_html_filter ?>
            <div>
                <?php echo $lists['treecategories']; ?>
            </div>
            <?php if ($this->show_vendor) { ?>
                <div>
                    <?php echo $lists['vendors']; ?>
                </div>
            <?php } ?>
            <?php if ($this->config->admin_show_product_labels) { ?>
                <div>
                    <?php echo $lists['labels'] ?>
                </div>
            <?php } ?>
            <div>
                <?php echo $lists['publish']; ?>
            </div>
            <div>
                <input name="text_search" id="text_search" value="<?php echo htmlspecialchars($text_search); ?>" class="form-control" placeholder="<?php print Text::_('JSHOP_SEARCH') ?>" type="text">
            </div>
            <div>
                <button type="submit" class="btn btn-primary hasTooltip" title="<?php print Text::_('JSHOP_SEARCH') ?>">
                    <span class="icon-search" aria-hidden="true"></span>
                </button>
            </div>
            <div>
                <button type="button" class="btn btn-primary js-stools-btn-clear"><?php echo Text::_('JSEARCH_FILTER_CLEAR'); ?></button>
            </div>
            <?php print $this->tmp_html_filter_end ?>
        </div>

        <table class="table table-striped">
            <thead>
                <tr>
                    <th width="20">
                        <input type="checkbox" name="checkall-toggle" value="" title="<?php echo Text::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" />
                    </th>
                    <th width="93">
                        <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_IMAGE'), 'product_name_image', $this->filter_order_Dir, $this->filter_order) ?>
                    </th>
                    <th>
                        <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_TITLE'), 'name', $this->filter_order_Dir, $this->filter_order) ?>
                    </th>
                    <?php print $this->tmp_html_col_after_title ?>
                    <?php if (!$category_id) { ?>
                        <th width="80">
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_CATEGORY'), 'category', $this->filter_order_Dir, $this->filter_order) ?>
                        </th>
                    <?php } ?>
                    <?php if ($this->show_vendor) { ?>
                        <th width="80">
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_VENDOR'), 'vendor', $this->filter_order_Dir, $this->filter_order) ?>
                        </th>
                    <?php } ?>
                    <?php if ($this->config->disable_admin['product_ean'] == 0 || $this->config->admin_product_list_manufacture_code || $this->config->admin_product_list_real_ean) { ?>
                        <th width="80">
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_EAN_PRODUCT'), 'ean', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <?php if ($this->config->stock) { ?>
                        <th width="60">
                            <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_QUANTITY'), 'qty', $this->filter_order_Dir, $this->filter_order); ?>
                        </th>
                    <?php } ?>
                    <th width="80">
                        <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_PRICE'), 'price', $this->filter_order_Dir, $this->filter_order); ?>
                    </th>
                    <th width="80">
                        Доп.Цена
                    </th>
                    <th width="40">
                        <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_HITS'), 'hits', $this->filter_order_Dir, $this->filter_order); ?>
                    </th>
                    <th width="40" class="center">
                        <?php echo Text::_('JSHOP_PUBLISH') ?>
                    </th>
                    <th width="40" class="center">
                        <?php echo Text::_('JSHOP_DELETE') ?>
                    </th>
                    <th width="30" class="center">
                        <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_ID'), 'product_id', $this->filter_order_Dir, $this->filter_order); ?>
                    </th>
                </tr>
            </thead>
            <tbody <?php if ($saveOrder): ?> class="js-draggable" data-url="<?php echo $saveOrderingUrl; ?>" data-direction="<?php echo strtolower($this->filter_order_Dir); ?>" data-nested="false"
                <?php endif; ?>>
                <?php foreach ($rows as $row) { ?>
                    <tr class="row<?php echo $i % 2; ?>" data-draggable-group="1" item-id="<?php echo $row->product_id; ?>" parents="" level="1">
                        <td>
                            <?php echo HTMLHelper::_('grid.id', $i, $row->product_id); ?>
                            <?php print $row->tmp_html_in_col_checkbox ?? ''; ?>
                        </td>
                        <td>
                            <?php if ($row->label_id) { ?>
                                <div class="product_label">
                                    <?php if (isset($row->_label_image) && $row->_label_image) { ?>
                                        <img src="<?php print $row->_label_image ?>" width="25" alt="" />
                                    <?php } else { ?>
                                        <span class="label_name"><?php print $row->_label_name; ?></span>
                                    <?php } ?>
                                </div>
                            <?php } ?>
                            <?php if ($row->image) { ?>
                                <a href="index.php?option=com_jshopping&controller=products&task=edit&product_id=<?php print $row->product_id ?>">
                                    <img src="<?php print Helper::getPatchProductImage($row->image, 'thumb', 1) ?>" width="90" border="0" />
                                </a>
                            <?php } ?>
                        </td>
                        <td>
                            <b>
                                <a href="index.php?option=com_jshopping&controller=products&task=edit&product_id=<?php print $row->product_id ?>"><?php echo $row->name; ?></a>
                            </b>
                            <div class="small"><?php echo $row->short_description; ?></div>
                        </td>
                        <?php print $row->tmp_html_col_after_title ?>
                        <?php if (!$category_id) { ?>
                            <td>
                                <?php echo $row->namescats; ?>
                            </td>
                        <?php } ?>
                        <?php if ($this->show_vendor) { ?>
                            <td>
                                <?php echo $row->vendor_name; ?>
                            </td>
                        <?php } ?>
                        <?php if ($this->config->disable_admin['product_ean'] == 0 || $this->config->admin_product_list_manufacture_code || $this->config->admin_product_list_real_ean) { ?>
                            <td>
                                <?php echo $row->ean ?>
                                <?php if ($this->config->admin_product_list_manufacture_code && $row->manufacturer_code != '') { ?>
                                    (<?php print $row->manufacturer_code ?>)
                                <?php } ?>
                                <?php if ($this->config->admin_product_list_real_ean && $row->real_ean != '') { ?>
                                    (<?php print $row->real_ean ?>)
                                <?php } ?>
                            </td>
                        <?php } ?>
                        <?php if ($this->config->stock) { ?>
                            <td class="quantity_td quantiti-js" data-product_id="<?php echo $row->product_id; ?>">
                                <?php if ($row->unlimited): ?>
                                    <span class="qty-display">
                                        <?php echo Text::_('JSHOP_UNLIMITED'); ?>
                                    </span>
                                    <input type="number" name="product_qty" class="qty-input" style="display:none;" value="0" />
                                    <span class="qty-unlimited" style="display:none;">
                                        <input type="checkbox" class="unlimit-input" name="unlimited" value="0" checked>
                                        <span>Неограничено</span>
                                    </span>
                                    <a class="btn btn-success qty-save-btn" style="display:none;">Сохранить</a>
                                <?php else: ?>
                                    <span class="qty-display"><?php echo floatval($row->qty); ?></span>
                                    <input type="number" name="product_qty" class="qty-input" style="display:none;" value="<?php echo floatval($row->qty); ?>" min="0" />
                                    <span class="qty-unlimited" style="display:none;">
                                        <input type="checkbox" class="unlimit-input" name="unlimited" value="0">
                                        <span>Неограничено</span>
                                    </span>
                                    <a class="btn btn-success qty-save-btn" style="display:none;">Сохранить</a>
                                <?php endif; ?>
                            </td>
                        <?php } ?>
                        <td class="price_td price-js" data-product_id="<?php echo $row->product_id; ?>" data-currency_id="<?php echo $row->currency_id; ?>">
                            <span class="price-text"><?php echo Helper::formatprice($row->product_price, Helper::sprintCurrency($row->currency_id)); ?></span>
                        </td>
                        <td class="prod_add_price prod_add_price-js" data-product_id="<?= (int) $row->product_id; ?>" data-currency_id="<?= (int) $row->currency_id; ?>">
                            <?php foreach ($row->product_add_prices as $key => $value): ?>
                                <span class="price-text" data-price_id="<?= (int) $value->price_id; ?>">
                                    <?= Helper::formatprice($value->final_price, Helper::sprintCurrency($row->currency_id)); ?>
                                </span>
                            <?php endforeach; ?>
                        </td>
                        <td>
                            <?php echo $row->hits; ?>
                        </td>
                        <td class="center">
                            <?php echo HTMLHelper::_('jgrid.published', $row->product_publish, $i); ?>
                        </td>

                        <td class="center">
                            <a class="btn btn-micro btn-nopad" href='index.php?option=com_jshopping&controller=productsquickedit&task=remove&cid[]=<?php print $row->product_id ?>'
                                onclick="return confirm('<?php print Text::_('JSHOP_DELETE') ?>')">
                                <i class="icon-delete"></i>
                            </a>
                        </td>
                        <td class="center">
                            <?php echo $row->product_id; ?>
                        </td>
                    </tr>
                    <?php
                    $i++;
                }
                ?>
            </tbody>
        </table>

        <div class="d-flex justify-content-between align-items-center">
            <div class="jshop_list_footer"><?php echo $pageNav->getListFooter(); ?></div>
            <div class="jshop_limit_box"><?php echo $pageNav->getLimitBox(); ?></div>
        </div>

        <input type="hidden" name="filter_order" value="<?php echo $this->filter_order ?>" />
        <input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir ?>" />
        <input type="hidden" name="task" value="" />
        <input type="hidden" name="hidemainmenu" value="0" />
        <input type="hidden" name="boxchecked" value="0" />
        <?php print $this->tmp_html_end ?>
    </form>
</div>
<script>
    jQuery(function () {
        jshopAdmin.setMainMenuActive(
            '<?php print Uri::base() ?>index.php?option=com_jshopping&controller=productsquickedit&category_id=0');
    });
    document.querySelectorAll('.quantiti-js').forEach(function (cell) {

        let span = cell.querySelector('.qty-display');
        let input = cell.querySelector('.qty-input');
        let checkbox = cell.querySelector('.qty-unlimited');
        let checkboxUnlimit = checkbox.querySelector('.unlimit-input');
        let btn = cell.querySelector('.qty-save-btn');
        let productId = cell.dataset.product_id;

        if (btn) {
            cell.addEventListener('click', function () {
                span.style.display = 'none';
                input.style.display = 'inline-block';
                checkbox.style.display = 'flex';
                btn.style.display = 'inline-block';
                input.focus();
            });

            btn.addEventListener('click', function () {
                let newQty = input.value;
                if (newQty === '' || newQty < 0) {
                    alert('Введите корректное количество');
                    return;
                }
                let valUnlimit = 0;

                if (checkboxUnlimit.checked) {
                    newQty = 1;
                    valUnlimit = 1;
                } else {
                    valUnlimit = 0;
                }

                saveQuantity(productId, newQty, valUnlimit, function (success) {
                    if (success) {
                        if (valUnlimit) {
                            span.textContent = 'Неограничено';
                        } else {
                            span.textContent = newQty;
                        }
                        span.style.display = 'inline';
                        input.style.display = 'none';
                        checkbox.style.display = 'none';
                        btn.style.display = 'none';
                    } else {
                        alert('Ошибка сохранения');
                    }
                });
            });
        }
    });


    function saveQuantity(productId, qty, val_unlimit, callback) {

        fetch('<?php print Uri::base() ?>index.php?option=com_jshopping&controller=productsquickedit&task=saveQuantity&format=json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId, quantity: qty, unlimit: val_unlimit, '<?php echo Session::getFormToken(); ?>': 1 })
        })
            .then(response => response.json())
            .then(data => {
                callback(data.success);
            })
            .catch(() => callback(false));
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.price-js').forEach(function (cell) {
            cell.addEventListener('click', function () {
                const span = this.querySelector('.price-text');
                if (!span) return;

                const priceValue = parseFloat(span.textContent.replace(/[^\d.,]/g, '').replace(',', '.'));
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.01';
                input.min = '0';
                input.value = priceValue.toFixed(2);
                input.classList.add('form-control');
                span.replaceWith(input);
                input.focus();

                input.addEventListener('blur', save);
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        save();
                    }
                });

                function save() {
                    const productId = cell.dataset.product_id;
                    const currencyId = cell.dataset.currency_id;
                    const newPrice = parseFloat(input.value);

                    updatePrice(productId, newPrice, function (success) {
                        const newSpan = document.createElement('span');
                        newSpan.className = 'price-text';
                        newSpan.textContent = success ? `${newPrice.toFixed(2)} грн.` : 'Ошибка';
                        input.replaceWith(newSpan);
                    });
                }
            });
        });
        document.querySelectorAll('.prod_add_price-js').forEach(function (cell) {
            cell.addEventListener('click', function (event) {
                const span = event.target.closest('.price-text');
                if (!span) return;

                const productId = cell.dataset.product_id;
                const currencyId = cell.dataset.currency_id;
                const priceId = span.dataset.price_id;
                const currencySymbol = getCurrencySymbol(currencyId);

                const priceValue = parseFloat(span.textContent.replace(/[^\d.,]/g, '').replace(',', '.'));
                const input = document.createElement('input');
                input.type = 'number';
                input.step = '0.01';
                input.min = '0';
                input.value = priceValue.toFixed(2);
                input.classList.add('form-control');

                span.replaceWith(input);
                input.focus();

                input.addEventListener('blur', saveAddPrice);
                input.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveAddPrice();
                    }
                });

                function getCurrencySymbol(id) {
                    const map = {
                        1: 'грн.',
                        2: '$',
                    };
                    return map[id] || '';
                }


                function saveAddPrice() {
                    const newPrice = parseFloat(input.value);

                    updateAddPrice(productId, priceId, newPrice, currencyId, function (success) {
                        const newSpan = document.createElement('span');
                        newSpan.className = 'price-text';
                        newSpan.dataset.price_id = priceId;
                        newSpan.textContent = success ? `${newPrice.toFixed(2)} ${currencySymbol}` : 'Ошибка';
                        input.replaceWith(newSpan);
                    });
                }
            });
        });
        
    });

    function updatePrice(productId, newPrice, callback) {
        fetch('<?php echo Uri::base(); ?>index.php?option=com_jshopping&controller=productsquickedit&task=savePrice&format=json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                price: newPrice,
                '<?php echo Session::getFormToken(); ?>': 1
            })
        })
            .then(r => r.json())
            .then(data => callback(data.success))
            .catch(() => callback(false));
    }

    function updateAddPrice(productId, priceId, newPrice, currencyId, callback) {
        fetch('<?= Uri::base(); ?>index.php?option=com_jshopping&controller=productsquickedit&task=saveAddPrice&format=json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_id: productId,
                price_id: priceId,
                price: newPrice,
                currency_id: currencyId,
                '<?= Session::getFormToken(); ?>': 1
            })
        })
            .then(response => response.json())
            .then(data => callback(data.success))
            .catch(() => callback(false));
    }

</script>

<style>
    .price_td,
    .quantity_td {
        width: 200px;
    }

    .price_td input,
    .quantity_td input {
        width: 100%;
    }

    .quantity_td .qty-unlimited input {
        width: auto;
    }

    .quantity_td button {
        margin-top: 5px;
        width: 100%;
    }

    .modal_price_group {
        display: none;
    }

    .modal_price_group.active {
        position: relative;
        display: block;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px -8px hsl(214, 40%, 50%);
    }

    .modal_price_group .close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
    }
</style>