<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
defined('_JEXEC') or die;
use Joomla\CMS\Language\Text;

function renderTree($list, $parent = 0, $level = 0)
{
    $branch = array_filter($list, function ($item) use ($parent) {
        return $item->parent_id == $parent;
    });

    if (!$branch)
        return;

    $classList = [];
    $classList[] = $level === 0 ? ' parent' : '';
    $childrenClass = $level > 0 ? 'mod-menu__sub inner' : 'mod-menu mod-list nav';
    $classSpan = $level == 0 ? 'image-title' : '';
    echo '<ul class="' . $childrenClass . ' level-' . $level . '">';
    if ($level > 0) {echo '<div class="top"><div class="cat-back icon-back">' . Text::_("TPL_CUSTOM_TO_CATALOG") . '</div><div class="close icon-close"></div></div>';}
    foreach ($branch as $item) {
        echo '<li class="nav-item' . implode(' ', $classList) . '">';
        echo '<a href="' . $item->link . '">';
            if($level==0){         
            echo '<span class="img-wrap"><img src="/components/com_jshopping/files/img_categories/'.$item->image.'" loading="lazy"></span><span class="show-subcat icon-next"></span>' ;
        }        
        echo '<span class="' . $classSpan . '">' . htmlspecialchars($item->name) . '</span>';
        echo '</a>';
        renderTree($list, $item->id, $level + 1);
        echo '</li>';
    }
    echo '</ul>';
}


?>
<div class="catalog_tree<?php echo $moduleclass_sfx; ?>">
    <?php renderTree($list); ?>
</div>