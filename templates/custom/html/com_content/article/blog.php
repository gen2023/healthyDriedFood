<?php

/**
 * @package     Joomla.Site
 * @subpackage  com_content
 *
 * @copyright   (C) 2006 Open Source Matters, Inc. <https://www.joomla.org>
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Language\Associations;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Layout\FileLayout;
use Joomla\CMS\Layout\LayoutHelper;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;
use Joomla\Component\Content\Administrator\Extension\ContentComponent;
use Joomla\Component\Content\Site\Helper\RouteHelper;
use Joomla\CMS\Helper\ModuleHelper;

/** @var \Joomla\Component\Content\Site\View\Article\HtmlView $this */
// Create shortcuts to some parameters.
$params = $this->item->params;
$canEdit = $params->get('access-edit');
$user = $this->getCurrentUser();
$info = $params->get('info_block_position', 0);
$htag = $this->params->get('show_page_heading') ? 'h2' : 'h1';

// Check if associations are implemented. If they are, define the parameter.
$assocParam = (Associations::isEnabled() && $params->get('show_associations'));
$currentDate = Factory::getDate()->format('Y-m-d H:i:s');
$isNotPublishedYet = $this->item->publish_up > $currentDate;
$isExpired = !is_null($this->item->publish_down) && $this->item->publish_down < $currentDate;


$materialId = $this->item->id;
$products = PlgSystemProduct_Materials::getRelatedProducts($materialId);

?>
<div class="container">
    <div class="mt50 mb25">
        <?php
        $module = ModuleHelper::getModules('breadcrumbs');
        $attribs['style'] = 'none';
        echo ModuleHelper::renderModule($module[0], $attribs);
        ?>
    </div>
    <div class="com-content-article item-page<?php echo $this->pageclass_sfx; ?>">
        <meta itemprop="inLanguage" content="<?php echo ($this->item->language === '*') ? Factory::getApplication()->get('language') : $this->item->language; ?>">
        <div class="left">
            <?php

            if ($products) {
                echo '<div class="slider-products">';
                foreach ($products as $p) {
                    $image = !empty($p->image)
                        ? Uri::root(true) . '/components/com_jshopping/files/img_products/thumb_' . $p->image
                        : Uri::root(true) . '/images/default_image.png';

                    // Формируем ссылку на товар через JSHelper::SEFLink
                    $link = \JSHelper::SEFLink(
                        'index.php?option=com_jshopping&controller=product&task=view&category_id='
                        . ($p->category_id ?? 0)
                        . '&product_id=' . $p->product_id,
                        1
                    ); ?>

                    <div class="prod-wrap1">
                        <div class="product">
                            <div class="top_prodoct">
                                <div class="image_block">
                                    <a href="<?= $link ?>">
                                        <img src="<?= $image ?>" alt="<?= htmlspecialchars($p->name) ?>">
                                    </a>
                                </div>
                                <div class="name">
                                    <a href="<?= $link ?>">
                                        <?= htmlspecialchars($p->name); ?>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                }
                echo '</div>';
            }


            ?>
        </div>
        <div class="com-content-article__body">

            <?php if ($this->params->get('show_page_heading')): ?>
                <div class="page-header">
                    <h1 class="ttl md"> <?php echo $this->escape($this->params->get('page_heading')); ?> </h1>
                </div>
            <?php endif;
            if (!empty($this->item->pagination) && !$this->item->paginationposition && $this->item->paginationrelative) {
                echo $this->item->pagination;
            }
            ?>

            <?php $useDefList = $params->get('show_modify_date') || $params->get('show_publish_date') || $params->get('show_create_date')
                || $params->get('show_hits') || $params->get('show_category') || $params->get('show_parent_category') || $params->get('show_author') || $assocParam; ?>

            <?php if ($params->get('show_title')): ?>
                <div class="page-header">
                    <<?php echo $htag; ?>>
                        <?php echo $this->escape($this->item->title); ?>
                    </<?php echo $htag; ?>>
                    <?php if ($this->item->state == ContentComponent::CONDITION_UNPUBLISHED): ?>
                        <span class="badge bg-warning text-light"><?php echo Text::_('JUNPUBLISHED'); ?></span>
                    <?php endif; ?>
                    <?php if ($isNotPublishedYet): ?>
                        <span class="badge bg-warning text-light"><?php echo Text::_('JNOTPUBLISHEDYET'); ?></span>
                    <?php endif; ?>
                    <?php if ($isExpired): ?>
                        <span class="badge bg-warning text-light"><?php echo Text::_('JEXPIRED'); ?></span>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            <?php if ($canEdit): ?>
                <?php echo LayoutHelper::render('joomla.content.icons', ['params' => $params, 'item' => $this->item]); ?>
            <?php endif; ?>

            <?php // Content is generated by content plugin event "onContentAfterTitle" ?>
            <?php echo $this->item->event->afterDisplayTitle; ?>

            <?php if ($useDefList && ($info == 0 || $info == 2)): ?>
                <?php echo LayoutHelper::render('joomla.content.info_block', ['item' => $this->item, 'params' => $params, 'position' => 'above']); ?>
            <?php endif; ?>

            <?php if ($info == 0 && $params->get('show_tags', 1) && !empty($this->item->tags->itemTags)): ?>
                <?php $this->item->tagLayout = new FileLayout('joomla.content.tags'); ?>

                <?php echo $this->item->tagLayout->render($this->item->tags->itemTags); ?>
            <?php endif; ?>

            <?php // Content is generated by content plugin event "onContentBeforeDisplay" ?>
            <?php echo $this->item->event->beforeDisplayContent; ?>

            <?php if ((int) $params->get('urls_position', 0) === 0): ?>
                <?php echo $this->loadTemplate('links'); ?>
            <?php endif; ?>
            <?php if ($params->get('access-view')): ?>
                <?php echo LayoutHelper::render('joomla.content.full_image', $this->item); ?>
                <?php
                if (!empty($this->item->pagination) && !$this->item->paginationposition && !$this->item->paginationrelative):
                    echo $this->item->pagination;
                endif;
                ?>
                <?php if (isset($this->item->toc)):
                    echo $this->item->toc;
                endif; ?>
                <?php echo $this->item->text; ?>

            <?php if ($info == 1 || $info == 2): ?>
                <?php if ($useDefList): ?>
                    <?php echo LayoutHelper::render('joomla.content.info_block', ['item' => $this->item, 'params' => $params, 'position' => 'below']); ?>
                <?php endif; ?>
                <?php if ($params->get('show_tags', 1) && !empty($this->item->tags->itemTags)): ?>
                    <?php $this->item->tagLayout = new FileLayout('joomla.content.tags'); ?>
                    <?php echo $this->item->tagLayout->render($this->item->tags->itemTags); ?>
                <?php endif; ?>
            <?php endif; ?>

            <?php
            if (!empty($this->item->pagination) && $this->item->paginationposition && !$this->item->paginationrelative):
                echo $this->item->pagination;
                ?>
            <?php endif; ?>
            <?php if ((int) $params->get('urls_position', 0) === 1): ?>
                <?php echo $this->loadTemplate('links'); ?>
            <?php endif; ?>
            <?php // Optional teaser intro text for guests ?>
        <?php elseif ($params->get('show_noauth') == true && $user->guest): ?>
            <?php echo LayoutHelper::render('joomla.content.intro_image', $this->item); ?>
            <?php echo HTMLHelper::_('content.prepare', $this->item->introtext); ?>
            <?php // Optional link to let them register to see the whole article. ?>
            <?php if ($params->get('show_readmore') && $this->item->fulltext != null): ?>
                <?php $menu = Factory::getApplication()->getMenu(); ?>
                <?php $active = $menu->getActive(); ?>
                <?php $itemId = $active->id; ?>
                <?php $link = new Uri(Route::_('index.php?option=com_users&view=login&Itemid=' . $itemId, false)); ?>
                <?php $link->setVar('return', base64_encode(RouteHelper::getArticleRoute($this->item->slug, $this->item->catid, $this->item->language))); ?>
                <?php echo LayoutHelper::render('joomla.content.readmore', ['item' => $this->item, 'params' => $params, 'link' => $link]); ?>
            <?php endif; ?>
        <?php endif; ?>
        <?php
        if (!empty($this->item->pagination) && $this->item->paginationposition && $this->item->paginationrelative):
            echo $this->item->pagination;
            ?>
        <?php endif; ?>
        <?php // Content is generated by content plugin event "onContentAfterDisplay" ?>
        <?php echo $this->item->event->afterDisplayContent; ?>
            </div>
    </div>
</div>