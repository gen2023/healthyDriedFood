<?php
use Joomla\CMS\Router\Route;
use Joomla\Component\Jshopping\Site\Helper\Helper;

defined('_JEXEC') or die;

?>

<div class="catalog_elements_list <?php echo $moduleclass_sfx; ?>">
    <?php foreach ($list as $item): ?>
        <div class="item">
            <?php if ($show_image) { ?>
                <a href="<?php echo $item->link; ?>">
                    <img class="catalog_img" src="<?php echo htmlspecialchars($item->imgSrc, ENT_QUOTES, 'UTF-8'); ?>"
                         alt="<?php echo htmlspecialchars($item->img_alt, ENT_QUOTES, 'UTF-8'); ?>"
                         title="<?php echo htmlspecialchars($item->img_title, ENT_QUOTES, 'UTF-8'); ?>">
                </a>
            <?php } ?>

            <?php if ($show_name) { ?>
                <div class="catalog_name">
                    <a href="<?php echo $item->link; ?>">
                    <?php echo $item->name; ?>
                    </a>
                </div>
            <?php } ?>
        </div>
    <?php endforeach; ?>
</div>
