<?php
use Joomla\Component\Jshopping\Site\Helper\Helper;
defined('_JEXEC') or die;

function renderTree($list, $parent = 0, $level = 0) {
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
        echo '<a href="' . $item->link . '">' . htmlspecialchars($item->name) . '</a>';
        renderTree($list, $item->id, $level + 1);
        echo '</li>';
    }
    echo '</ul>';
}


?>
<div class="catalog_tree<?php echo $moduleclass_sfx; ?>">
    <?php renderTree($list); ?>
</div>
