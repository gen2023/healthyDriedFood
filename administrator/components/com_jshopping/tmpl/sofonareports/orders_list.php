<?php
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Text;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die();
$rows = $this->rows;
$lists = $this->lists;
$pageNav = $this->pageNav;
$jshopConfig = JSFactory::getConfig();
$params = $this->settingsPlg;
?>

<div id="j-main-container" class="j-main-container">


  <form name="adminForm" id="adminForm" method="post" action="index.php?option=com_jshopping&controller=sofonareports&task=reportsorder">
    <?php echo HTMLHelper::_('form.token'); ?>

    <div class="js-filters">
      <div class="block_search_cliens">
        <input type="text" id="clientSearch" placeholder="Поиск клиента..." class="form-control"
          value="<?= isset($this->current_client['name']) ? htmlspecialchars($this->current_client['name']) : ''; ?>" style="margin-bottom:5px;">

        <div class="list_search_client list_search_client-js"></div>
        <?php print $lists['clients']; ?>
      </div>
      <div>
        <?php print $lists['client_type']; ?>
      </div>
      <?php if ($this->countCurrency > 1) { ?>
        <div><?php echo $lists['currencies']; ?></div>
      <?php } ?>
      <div>
        <?php print $lists['changestatus']; ?>
      </div>
      <div>
        <?php print $lists['notfinished']; ?>
      </div>
      <?php if (!$jshopConfig->without_payment) { ?>
        <div>
          <?php print $lists['payments']; ?>
        </div>
      <?php } ?>
      <?php if (!$jshopConfig->without_shipping) { ?>
        <div>
          <?php print $lists['shippings']; ?>
        </div>
      <?php } ?>
      <div>
        <?php echo HTMLHelper::_('calendar', $this->filter['date_from'], 'date_from', 'date_from', $jshopConfig->store_date_format, array('class' => 'inputbox middle2', 'size' => '5', 'maxlength' => '10', 'placeholder' => Text::_('JSHOP_DATE_FROM'))); ?>
      </div>
      <div>
        <?php echo HTMLHelper::_('calendar', $this->filter['date_to'], 'date_to', 'date_to', $jshopConfig->store_date_format, array('class' => 'inputbox middle2', 'size' => '5', 'maxlength' => '10', 'placeholder' => Text::_('JSHOP_DATE_TO'))); ?>
      </div>

      <div>
        <button type="submit" class="btn btn-primary hasTooltip" title="<?php print Text::_('JSHOP_SEARCH') ?>">
          <span class="icon-search" aria-hidden="true"></span>
        </button>
      </div>
      <div>
        <button type="button" class="btn btn-primary js-stools-btn-clear"><?php echo Text::_('JSEARCH_FILTER_CLEAR'); ?></button>
      </div>
      <div>
        <a href="/" id="exportOrderXlsBtn" class="btn btn-success exportXlsBtn" data-type="order">
          <span class="icon-download" aria-hidden="true"></span> <?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_BTN_EXPORT'); ?>
        </a>
      </div>
    </div>
    <?php if ($params['show_chart_order']) { ?>
      <div class="container-graphic">
        <div class="card p-4 mt-3 mb-3">
          <h3><?php echo Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_HEADING_CHART_ORDER'); ?></h3>
          <div class="ordersChart-js" data-labels='<?= $this->chartLabels ?>' data-dates='<?= $this->chartValues ?>' data-sums='<?= $this->chartValuesSum ?>'>
            <canvas id="ordersChart" style="width:100%;max-height:300px"></canvas>
          </div>
        </div>
      </div>
    <?php } ?>

    <table class="table table-striped shop-list-order">
      <thead>
        <tr>
          <th width="20">
            #
          </th>
          <th width="20">
            <input type="checkbox" name="checkall-toggle" value="" title="<?php echo Text::_('JGLOBAL_CHECK_ALL'); ?>" onclick="Joomla.checkAll(this)" />
          </th>
          <th width="20">
            <?php echo HTMLHelper::_('grid.sort', 'JSHOP_ID', 'order_id', $this->filter_order_Dir, $this->filter_order); ?>
          </th>

          <?php if ($params['order_number']) { ?>
            <th width="20">
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_NUMBER'), 'order_number', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>

          <?php if ($params['order_user']) { ?>
            <th>
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_USER'), 'name', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if ($params['order_email']) { ?>
            <th>
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_EMAIL'), 'email', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if ($params['order_phone']) { ?>
            <th>
              <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_LABEL_USER_PHONE') ?>
            </th>
          <?php } ?>
          <?php if ($params['order_countProduct']) { ?>
            <th>
              <?= Text::_('PLG_JSHOPPINGADMIN_SOFONAREPORTS_COUNT_PRODUCT') ?>
            </th>
          <?php } ?>
          <?php if ($params['order_nameProduct']) { ?>
            <th>
              <?= Text::_('JSHOP_NAME_PRODUCT') ?>
            </th>
          <?php } ?>

          <?php if ($this->show_vendor && $params['order_vendor']) { ?>
            <th>
              <?php echo Text::_('JSHOP_VENDOR') ?>
            </th>
          <?php } ?>
          <?php if ($params['order_pdf']) { ?>
            <th class="center">
              <?php echo Text::_('JSHOP_ORDER_PRINT_VIEW') ?>
            </th>
          <?php } ?>
          <?php if ($params['order_date']) { ?>
            <th>
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_DATE'), 'order_date', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if ($params['order_m_date']) { ?>
            <th>
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_ORDER_MODIFY_DATE'), 'order_m_date', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if (!$jshopConfig->without_payment && $params['order_payment']) { ?>
            <th>
              <?php echo Text::_('JSHOP_PAYMENT') ?>
            </th>
          <?php } ?>
          <?php if (!$jshopConfig->without_shipping && $params['order_shipping']) { ?>
            <th>
              <?php echo Text::_('JSHOP_SHIPPINGS') ?>
            </th>
          <?php } ?>
          <?php if ($params['order_status']) { ?>
            <th>
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_STATUS'), 'order_status', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>
          <?php if ($params['order_total']) { ?>
            <th>
              <?php echo HTMLHelper::_('grid.sort', Text::_('JSHOP_ORDER_TOTAL'), 'order_total', $this->filter_order_Dir, $this->filter_order) ?>
            </th>
          <?php } ?>

          <?php if ($params['order_add_info']) { ?>
            <th>
              <?php echo Text::_('JSHOP_COMMENT') ?>
            </th>
          <?php } ?>

          <?php if ($jshopConfig->shop_mode == 1 && $params['order_shop_mode']) { ?>
            <th class="center">
              <?php echo Text::_('JSHOP_TRANSACTIONS') ?>
            </th>
          <?php } ?>
        </tr>
      </thead>
      <?php
      $i = 0;
      foreach ($rows as $row) {
        $display_info_order = $row->display_info_order;
        ?>
        <tr class="row<?php echo ($i % 2); ?> <?php if (!$row->order_created)
                print 'order_not_created' ?>">
            <td>
            <?php echo $pageNav->getRowOffset($i); ?>
          </td>
          <td>
            <?php if ($row->blocked) { ?>
              <i class="icon-checkedout"></i>
            <?php } else { ?>
              <?php echo HTMLHelper::_('grid.id', $i, $row->order_id); ?>
            <?php } ?>
          </td>
          <td class="center">
            <a class="order_detail" href="index.php?option=com_jshopping&controller=orders&task=show&order_id=<?php echo $row->order_id ?>"><?php echo $row->order_id; ?></a>
          </td>
          <?php if ($params['order_number']) { ?>
            <td>
              <a class="order_detail" href="index.php?option=com_jshopping&controller=orders&task=show&order_id=<?php echo $row->order_id ?>"><?php echo $row->order_number; ?></a>
              <?php if (!$row->order_created)
                print "(" . Text::_('JSHOP_NOT_FINISHED') . ")"; ?>
            </td>
          <?php } ?>
          <?php if ($params['order_user']) { ?>
            <td>
              <?php if ($row->user_id > 0) { ?>
                <a href="index.php?option=com_jshopping&controller=users&task=edit&user_id=<?php print $row->user_id ?>">
                <?php } ?>
                <?php echo $row->name ?>
                <?php if ($row->user_id > 0) { ?>
                </a>
              <?php } ?>
            </td>
          <?php } ?>

          <?php if ($params['order_email']) { ?>
            <td><?php echo $row->email ?></td>
          <?php } ?>
          <?php if ($params['order_phone']) { ?>
            <td><?php echo $row->phone ?></td>
          <?php } ?>
          <?php if ($params['order_countProduct']) { ?>
            <td><?php echo $row->countProduct; ?></td>
          <?php } ?>
          <?php if ($params['order_nameProduct']) { ?>
            <td><?php echo $row->products; ?></td>
          <?php } ?>

          <?php if ($this->show_vendor && $params['order_vendor']) { ?>
            <td>
              <?php print $row->vendor_name; ?>
            </td>
          <?php } ?>
          <?php if ($params['order_pdf']) { ?>
            <td class="center">
              <?php if ($jshopConfig->generate_pdf) { ?>
                <?php if ($display_info_order) { ?>
                  <?php if ($row->pdf_file != '') { ?>
                    <a class="js_window_popup" patch="<?php echo $jshopConfig->pdf_orders_live_path . "/" . $row->pdf_file ?>" title="<?php print Text::_('JSHOP_EMAIL_BILL') ?>">
                      <i class="icon-print"></i>
                    </a>
                    <?php echo $row->_after_order_pdf ?? ''; ?>
                  <?php } elseif ($jshopConfig->send_invoice_manually && $row->order_created) { ?>
                    <a href="index.php?option=com_jshopping&controller=orders&task=send&order_id=<?php echo $row->order_id ?>&back=orders" title="<?php print Text::_('JSHOP_SEND_MAIL') ?>">
                      <i class="icon-envelope"></i>
                    </a>
                  <?php } ?>
                <?php } ?>
              <?php } else { ?>
                <a class="js_window_popup" patch="index.php?option=com_jshopping&controller=orders&task=printOrder&order_id=<?php echo $row->order_id ?>&tmpl=component">
                  <i class="icon-print print-html"></i>
                </a>
              <?php } ?>
              <?php if (isset($row->_ext_order_info))
                echo $row->_ext_order_info; ?>
            </td>
          <?php } ?>
          <?php if ($params['order_date']) { ?>
            <td>
              <?php echo Helper::formatdate($row->order_date, 1); ?>
            </td>
          <?php } ?>
          <?php if ($params['order_m_date']) { ?>
            <td>
              <?php echo Helper::formatdate($row->order_m_date, 1); ?>
            </td>
          <?php } ?>
          <?php if (!$jshopConfig->without_payment && $params['order_payment']) { ?>
            <td>
              <?php echo $row->payment_name ?>
            </td>
          <?php } ?>
          <?php if (!$jshopConfig->without_shipping && $params['order_shipping']) { ?>
            <td>
              <?php echo $row->shipping_name ?>
            </td>
          <?php } ?>
          <?php if ($params['order_status']) { ?>
            <td><?= $row->status_name; ?></td>
          <?php } ?>
          <?php if ($params['order_total']) { ?>
            <td>
              <?php if ($display_info_order)
                echo Helper::formatprice($row->order_total, $row->currency_code) ?>
              </td>
          <?php } ?>
          <?php if ($params['order_add_info']) { ?>
            <td>
              <?php echo $row->order_add_info ?>
            </td>
          <?php } ?>
          <?php if ($jshopConfig->shop_mode == 1 && $params['order_shop_mode']) { ?>
            <td class="center">
              <a class="btn btn-micro btn-nopad" href='index.php?option=com_jshopping&controller=orders&task=transactions&order_id=<?php print $row->order_id; ?>'>
                <i class="icon-tree-2"></i>
              </a>
            </td>
          <?php } ?>

        </tr>
        <?php
        $i++;
      }
      ?>
      <tr>
        <?php
        $cols = 9;
        if (!$jshopConfig->without_payment)
          $cols++;
        if (!$jshopConfig->without_shipping)
          $cols++;
        if ($this->show_vendor)
          $cols++;
        ?>
        <td colspan="<?php print $cols + (int) $this->deltaColspan0 ?>" class="right">
          <b><?php print Text::_('JSHOP_TOTAL') ?></b>
        </td>
        <td><b><?php print Helper::formatprice($this->total, Helper::getMainCurrencyCode()) ?></b></td>
        <?php if ($jshopConfig->shop_mode == 1) { ?>
          <td></td>
        <?php } ?>
        <td colspan="2"></td>
      </tr>
    </table>

    <div class="d-flex justify-content-between align-items-center">
      <div class="jshop_list_footer"><?php echo $pageNav->getListFooter(); ?></div>
      <div class="jshop_limit_box"><?php echo $pageNav->getLimitBox(); ?></div>
    </div>

    <input type="hidden" name="filter_order" value="<?php echo $this->filter_order ?>" />
    <input type="hidden" name="filter_order_Dir" value="<?php echo $this->filter_order_Dir ?>" />
    <input type="hidden" name="task" value="reportsorder" />
    <input type="hidden" name="type" value="order" />
    <input type="hidden" name="boxchecked" value="0" />
    <input type="hidden" name="js_nolang" id='js_nolang' value="0">
  </form>
</div>