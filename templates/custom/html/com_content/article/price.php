<?php
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\Database\DatabaseInterface;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\Component\Jshopping\Site\Model\Productlist\ListModel;
use Joomla\CMS\Language\Text;

require_once JPATH_ROOT . '/components/com_jshopping/bootstrap.php';

$app = Factory::getApplication();

$jshopConfig = JSFactory::getConfig();
$lang = JSFactory::getLang();

$sort = $app->input->getCmd('sort', 'name_asc');
$opt = $app->input->getCmd('opt', '1');

/** @var DatabaseInterface $db */
$db = Factory::getContainer()->get(DatabaseInterface::class);

$query = $db->getQuery(true)
  ->select('p.product_id')
  ->from($db->quoteName('#__jshopping_products', 'p'))
  ->where('p.product_publish = 1');

$db->setQuery($query);
$productIds = $db->loadColumn();

/** @var ListModel $model */
$model = JSFactory::getModel('List', 'Site\\Productlist');

$nameField = $lang->get('name');

switch ($sort) {
  case 'price_desc':
    $order = 'prod.product_price';
    $orderby = 'DESC';
    break;

  case 'name_asc':
    $order = "name";
    $orderby = 'ASC';
    break;

  case 'name_desc':
    $order = "name";
    $orderby = 'DESC';
    break;

  case 'price_asc':
  default:
    $order = 'prod.product_price';
    $orderby = 'ASC';
    break;
}

if (empty($order)) {
  $order = 'prod.product_id';
  $orderby = 'ASC';
}

$products = $model->getLoadProducts(
  ['products' => $productIds],
  $order,
  $orderby
);



?>

<div class="mt50 mb15"></div>
<div class="container price_list_product">
  <div class="card" style="padding:15px; margin-bottom:20px;">
    <div class="search_block">
      <label for="searchName"><?php echo Text::_('TPL_CUSTOM_LABEL_SEARCH_BY_NAME'); ?>:</label>
      <input type="text" id="searchName" placeholder="<?php echo Text::_('TPL_CUSTOM_LABEL_SEARCH_BY_NAME_PLACEHOLDER'); ?>..." style="padding:5px; width:300px;" class="form-control">
    </div>
    <form method="get" class="jshop-sort-form">
      <input type="hidden" name="Itemid" value="<?= (int) $app->input->getInt('Itemid') ?>">

      <label for="sort"><?php echo Text::_('TPL_CUSTOM_LABEL_SORTING'); ?>:</label>
      <select name="sort" id="sort" onchange="this.form.submit()" class="form-select">
        <option value="price_asc" <?= $sort === 'price_asc' ? 'selected' : '' ?>><?php echo Text::_('TPL_CUSTOM_SELECT_OPTION_PRICE'); ?> ↑</option>
        <option value="price_desc" <?= $sort === 'price_desc' ? 'selected' : '' ?>><?php echo Text::_('TPL_CUSTOM_SELECT_OPTION_PRICE'); ?> ↓</option>
        <!-- <option value="name_asc"   <?= $sort === 'name_asc' ? 'selected' : '' ?>>Название ↑</option> -->
        <!-- <option value="name_desc"  <?= $sort === 'name_desc' ? 'selected' : '' ?>>Название ↓</option> -->
      </select>
    </form>

  </div>

  <table id="productsTable" class="jshop-price-table" style="width:100%; border-collapse:collapse;">
    <thead>
      <tr>
        <th><?php echo Text::_('TPL_CUSTOM_COLUMN_TABLE_PHOTO'); ?></th>
        <th><?php echo Text::_('TPL_CUSTOM_COLUMN_TABLE_NAME'); ?></th>
        <th><?php echo Text::_('TPL_CUSTOM_COLUMN_TABLE_PRICE'); ?></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <?php foreach ($products as $product):
        $image = $product->image ? $product->image : '/components/com_jshopping/files/img_products/noimage.gif';
        if ($opt) {
          $product->product_price *= 0.9;
        }
        ?>
        <tr>
          <td><img src="<?= $image ?>" width="80"></td>
          <td class="product-name">
            <div class="name"><?= htmlspecialchars($product->name) ?></div>
          </td>
          <td>
            <?= number_format($product->product_price, 2, '.', ' ') ?>
            <?= $jshopConfig->currency_code ?>
          </td>
          <td>
            <a href="<?= $product->product_link ?>" target="_blank" class="btn btn-small"><?php echo Text::_('TPL_CUSTOM_GO_PRODUCT'); ?></a>
          </td>
        </tr>
      <?php endforeach; ?>
    </tbody>
  </table>
</div>
<div class="mt50 mb15"></div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchName');
    const table = document.getElementById('productsTable');
    const rows = table.querySelectorAll('tbody tr');

    searchInput.addEventListener('input', function () {
      const filter = this.value.toLowerCase();

      rows.forEach(row => {
        const nameCell = row.querySelector('.product-name').textContent.toLowerCase();
        if (nameCell.includes(filter)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
</script>