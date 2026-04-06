<?php
defined('_JEXEC') or die;
?>
<script>
function filterRelatedProducts(input) {
  console.log('111111111111111111111111');
  
    const val = input.value.toLowerCase();
    const select = document.querySelector('select[name="jform[params][related_products][]"]');
    if (!select) return;

    select.querySelectorAll('option').forEach(option => {
        option.style.display = option.text.toLowerCase().includes(val) ? '' : 'none';
    });
}
</script>