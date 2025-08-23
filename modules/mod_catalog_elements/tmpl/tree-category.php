<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
defined('_JEXEC') or die;

function renderTree($list, $parent = 0, $level = 0,$count_products) {
    $branch = array_filter($list, function ($item) use ($parent) {
        return $item->parent_id == $parent;
    });

    if (!$branch) return;

        $classList = [];
        $classList[] = $level === 0 ? ' parent' : '';
        $childrenClass = $level > 0  ? 'chield-menu' : 'tree-category';

    echo '<ul class="'. $childrenClass . ' level-' . $level . '">';
    foreach ($branch as $item) {

        echo '<li class="item' . implode(' ', $classList) . '">';
        echo '<a href="' . $item->link . '">';
        echo htmlspecialchars($item->name);
        if($count_products){
            echo '('.$item->product_count.')';
        }
        echo '</a>';
        renderTree($list, $item->id, $level + 1);
        echo '</li>';
    }
    echo '</ul>';
}


?>
<div class="catalog_tree<?php echo $moduleclass_sfx; ?>">
    <?php renderTree($list,0,0,$count_products); ?>
</div>
