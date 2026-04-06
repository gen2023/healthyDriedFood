<?php
/**
 * @version      5.6.0 10.03.2025
 * @author       MAXXmarketing GmbH
 * @package      Jshopping
 * @copyright    Copyright (C) 2010 webdesigner-profi.de. All rights reserved.
 * @license      GNU/GPL
 */
namespace Joomla\Component\Jshopping\Administrator\Controller;
use Joomla\CMS\Pagination\Pagination;
use Joomla\CMS\Factory;
use Joomla\Component\Jshopping\Site\Lib\JSFactory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\Database\DatabaseInterface;

defined('_JEXEC') or die();

class BuhgalteriaController extends BaseadminController
{
  function display($cachable = false, $urlparams = false)
  {
    // die;
    $jshopConfig = JSFactory::getConfig();
    $app = Factory::getApplication();

    $model = JSFactory::getModel("sofonareports");
    $context = "jshopping.list.admin.buhgalteria";

    $filter_order = $app->getUserStateFromRequest($context . 'filter_order', 'filter_order', 'total_sum', 'cmd');
    $filter_order_Dir = $app->getUserStateFromRequest($context . 'filter_order_Dir', 'filter_order_Dir', 'DESC', 'cmd');


    $totalProducts = $model->getProductsReportCount();
    $pageNavProducts = new Pagination($totalProducts, 0, 100);

    $filter = [];

    // $productRows = $model->getProductsReport($filter, $pageNavProducts->limitstart, $pageNavProducts->limit, $filter_order, $filter_order_Dir);
    $productRows = $model->getProductsReport($filter, 0, 100, $filter_order, $filter_order_Dir);

    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $productIds = array_column($productRows, 'product_id');

    $totalExpenses = [];
    if (!empty($productIds)) {
      $query = $db->getQuery(true)
        ->select('product_id, SUM(expenses) as total, comments')
        ->from($db->quoteName('#__jshopping_expenses'))
        ->where('product_id IN (' . implode(',', array_map('intval', $productIds)) . ')')
        ->group('product_id');

      $db->setQuery($query);
      $results = $db->loadAssocList('product_id', 'total');

      foreach ($results as $pid => $sum) {
        $totalExpenses[$pid] = (float) $sum;
      }
    }

    foreach ($productRows as &$product) {
      $product->total_sum_expenses = $totalExpenses[$product->product_id] ?? 0;
    }
    unset($product);

    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $query = $db->getQuery(true)
      ->select('c.consumable_id, c.name, IFNULL(SUM(e.expenses), 0) AS total_sum, e.comments')
      ->from($db->quoteName('#__jshopping_expenses_consumables', 'c'))
      ->leftJoin($db->quoteName('#__jshopping_expenses', 'e') . ' ON e.consumable_id = c.consumable_id')
      ->group('c.consumable_id, c.name')
      ->order('c.name ASC');

    $db->setQuery($query);
    $consumablesList = $db->loadObjectList();

    $totalIncome = 0;
    foreach ($productRows as $product) {
      $totalIncome += (float) $product->total_sum;
    }

    $totalExpenseProducts = 0;
    foreach ($productRows as $product) {
      $totalExpenseProducts += (float) $product->total_sum_expenses;
    }

    $totalExpenseConsumables = 0;
    foreach ($consumablesList as $consumable) {
      $totalExpenseConsumables += (float) $consumable->total_sum;
    }

    /* миесячная статистика */
    $query = $db->getQuery(true)
  ->select([
    "DATE_FORMAT(e.date, '%Y-%m') AS month",
    "SUM(CASE WHEN e.product_id > 0 THEN e.expenses ELSE 0 END) AS product_expenses",
    "SUM(CASE WHEN e.consumable_id > 0 THEN e.expenses ELSE 0 END) AS consumable_expenses"
  ])
  ->from($db->quoteName('#__jshopping_expenses', 'e'))
  ->group("DATE_FORMAT(e.date, '%Y-%m')")
  ->order("month DESC");

$db->setQuery($query);
$expensesByMonth = $db->loadObjectList('month');

$query = $db->getQuery(true)
  ->select([
    "DATE_FORMAT(o.order_date, '%Y-%m') AS month",
    "SUM(oi.product_item_price * oi.product_quantity) AS income"
  ])
  ->from('#__jshopping_order_item AS oi')
  ->leftJoin('#__jshopping_orders AS o ON o.order_id = oi.order_id')
  ->group("DATE_FORMAT(o.order_date, '%Y-%m')")
  ->order("month DESC");

$db->setQuery($query);
$incomeByMonth = $db->loadObjectList('month');

$statistics = [];

$allMonths = array_unique(array_merge(
  array_keys($expensesByMonth),
  array_keys($incomeByMonth)
));

foreach ($allMonths as $month) {
  $statistics[] = (object)[
    'month' => $month,
    'product_expenses' => $expensesByMonth[$month]->product_expenses ?? 0,
    'consumable_expenses' => $expensesByMonth[$month]->consumable_expenses ?? 0,
    'income' => $incomeByMonth[$month]->income ?? 0,
  ];
}

usort($statistics, function ($a, $b) {
    return strcmp($b->month, $a->month);
});

    /* миесячная статистика конец */



    $view = $this->getView("buhgalteria", 'html');
    $view->setLayout("default");
    $view->set('productRows', $productRows);
    $view->set('pageNavProducts', $pageNavProducts);
    $view->set('filter_order_Dir', $filter_order_Dir);
    $view->set('filter_order', $filter_order);
    $view->set('consumablesList', $consumablesList);
    $view->set('totalIncome', $totalIncome);
    $view->set('totalExpenseProducts', $totalExpenseProducts);
    $view->set('totalExpenseConsumables', $totalExpenseConsumables);
    $view->set('statistics', $statistics);

    $view->display();

  }

  public function addExpenses()
  {
    $app = Factory::getApplication();
    $input = $app->input;

    $expenses = $input->getFloat('expenses');
    $product_id = $input->getInt('product_id', $input->getInt('product_list', 0));
    $consumable_id = $input->getInt('consumable_id', 0);
    $dateInput = $input->getString('date');
    $from_edit = $input->getInt('from_edit', 1);
    $comments = $input->getString('comments');

    // var_dump($comments);die;

    if ($expenses <= 0) {
      $app->enqueueMessage('Ошибка: введите корректную сумму расходов', 'error');
      $this->redirectBack($product_id);
      return;
    }

    if ($from_edit == 1) {
      if ($product_id <= 0) {
        $app->enqueueMessage('Ошибка: выберите товар', 'error');
        $this->redirectBack($product_id);
        return;
      }
    }


    $date = null;
    if (!empty($dateInput)) {
      $dateObj = \DateTime::createFromFormat('d.m.Y', $dateInput);
      if ($dateObj) {
        $date = $dateObj->format('Y-m-d');
      }
    }
    if (empty($date)) {
      $date = date('Y-m-d');
    }

    $db = Factory::getContainer()->get(DatabaseInterface::class);
    $query = $db->getQuery(true);

    $columns = ['expenses', 'product_id', 'consumable_id', 'date', 'comments'];
    $values = [
      $db->quote($expenses),
      $db->quote($product_id),
      $db->quote($consumable_id),
      $db->quote($date),
      $db->quote($comments)
    ];

    $query
      ->insert($db->quoteName('#__jshopping_expenses'))
      ->columns($db->quoteName($columns))
      ->values(implode(',', $values));

    $db->setQuery($query)->execute();

    $app->enqueueMessage('Расход добавлен', 'message');

    if ($from_edit == 1) {
      $this->redirectBack($product_id);
    } else {
      $this->redirectBack($consumable_id);
    }


  }

  /**
   * Редирект с учётом контекста
   */
  private function redirectBack($id)
  {
    $input = Factory::getApplication()->input;
    $from_edit = $input->getCmd('from_edit', 0);

    if ($from_edit == 1) {
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria&task=editProduct&product_id={$id}");
    } else {
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria&task=editConsumable&consumable_id={$id}");
    }
  }



  public function editProduct()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $product_id = $input->getInt('product_id');

    if ($product_id <= 0) {
      $app->enqueueMessage('Ошибка: неверный товар', 'error');
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria");
      return;
    }

    // Загружаем сам товар
    $query = $db->getQuery(true)
      ->select('product_id, `name_ru-RU` as product_name, product_ean')
      ->from($db->quoteName('#__jshopping_products'))
      ->where('product_id = ' . (int) $product_id);
    $db->setQuery($query);
    $product = $db->loadObject();

    if (!$product) {
      $app->enqueueMessage('Товар не найден', 'error');
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria");
      return;
    }

    // Загружаем все расходы по товару
    $query = $db->getQuery(true)
      ->select('*')
      ->from($db->quoteName('#__jshopping_expenses'))
      ->where('product_id = ' . (int) $product_id)
      ->order('date DESC');
    $db->setQuery($query);
    $expenses = $db->loadObjectList();

    // Передаём во view
    $view = $this->getView("buhgalteria", 'html');
    $view->setLayout("editproduct");
    $view->set('product', $product);
    $view->set('expenses', $expenses);
    $view->displayEditProduct();
  }
  public function saveExpenses()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $product_id = $input->getInt('product_id');
    $consumable_id = $input->getInt('consumable_id');
    $expenses = $input->get('expenses', [], 'array');

    foreach ($expenses as $id => $data) {
      // var_dump($data);die; //Y-m-d
      if (!empty($data['delete'])) {
        // Удаление
        $query = $db->getQuery(true)
          ->delete('#__jshopping_expenses')
          ->where('id = ' . (int) $id);
        $db->setQuery($query)->execute();
        continue;
      }

      $convertDate = null;
      if (!empty($data['date'])) {
        $dt = \DateTime::createFromFormat('d.m.Y', $data['date']);
        if ($dt) {
          $convertDate = $dt->format('Y-m-d');
        } else {
          // если дата уже в нужном формате — оставляем как есть
          $convertDate = $data['date'];
        }
      }

      // Обновление
      $fields = [
        $db->quoteName('expenses') . ' = ' . $db->quote((float) $data['amount']),
        $db->quoteName('date') . ' = ' . $db->quote($convertDate),
        $db->quoteName('comments') . ' = ' . $db->quote($data['comments']),
      ];

      $query = $db->getQuery(true)
        ->update('#__jshopping_expenses')
        ->set($fields)
        ->where('id = ' . (int) $id);
      $db->setQuery($query)->execute();
    }

    $app->enqueueMessage('Изменения сохранены', 'message');
    if ($consumable_id) {
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria&task=editConsumable&consumable_id={$consumable_id}");
    } else {
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria&task=editProduct&product_id={$product_id}");
    }

  }

  public function addConsumable()
  {

    $app = Factory::getApplication();
    $input = $app->input;
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $name = trim($input->getString('name'));

    if ($name === '') {
      $app->enqueueMessage('Ошибка: введите название расходника', 'error');
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria");
      return;
    }

    $query = $db->getQuery(true)
      ->insert($db->quoteName('#__jshopping_expenses_consumables'))
      ->columns($db->quoteName('name'))
      ->values($db->quote($name));
    $db->setQuery($query)->execute();

    $app->enqueueMessage('Расходник добавлен', 'message');
    $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria");
  }

  public function editConsumable()
  {
    $app = Factory::getApplication();
    $input = $app->input;
    $db = Factory::getContainer()->get(DatabaseInterface::class);

    $consumable_id = $input->getInt('consumable_id');

    if ($consumable_id <= 0) {
      $app->enqueueMessage('Ошибка: неверный расходник', 'error');
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria");
      return;
    }

    $query = $db->getQuery(true)
      ->select('*')
      ->from($db->quoteName('#__jshopping_expenses_consumables'))
      ->where('consumable_id = ' . (int) $consumable_id);
    $db->setQuery($query);
    $consumable = $db->loadObject();

    if (!$consumable) {
      $app->enqueueMessage('Расходник не найден', 'error');
      $this->setRedirect("index.php?option=com_jshopping&controller=buhgalteria");
      return;
    }


    $query = $db->getQuery(true)
      ->select('*')
      ->from($db->quoteName('#__jshopping_expenses'))
      ->where('consumable_id = ' . (int) $consumable_id)
      ->order('date DESC');
    $db->setQuery($query);
    $expensesConsumable = $db->loadObjectList();



    $view = $this->getView("buhgalteria", 'html');
    $view->setLayout("editconsumable");
    $view->set('expensesConsumable', $expensesConsumable);
    $view->set('consumable', $consumable);
    $view->set('consumable_id', $consumable_id);
    $view->displayEditExpenses();
  }

}