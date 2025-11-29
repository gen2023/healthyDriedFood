<?php
use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;

Factory::getLanguage()->load('mod_jshopping_filters_extended', JPATH_SITE);
$_lang = JSFactory::getModel("languages");
$languages = $_lang->getAllLanguages(1);

$attributes_model = JSFactory::getModel("attribut");
$attributes = $attributes_model->getAllAttributes();

$_productfields = JSFactory::getModel("productFields");
$exfields = $_productfields->getList();
?>

<fieldset class = "adminform">
    <table class = "admintable" style="width: 100%">            
    <tr>
        <td class="name" style="width: 180px">
            <?php print Text::_('Clear_cache')?>
        </td>
        <td>
            <input type="checkbox" name="clear_cache" value="1">
        </td>
    </tr>
    <tr>
        <td class="name" style="width: 180px">
            <?php print Text::_('MOD_FILTERS_EXTENDED_CATEGORY_CHARACTERISTICS_SETTINGS')?>
        </td>
        <td>
            <input type="hidden" name="params[category_characteristics_settings]" value="0">
            <input type="checkbox" name="params[category_characteristics_settings]" value="1" <?php echo ($this->params['category_characteristics_settings'] ?? 0) ? 'checked' : '' ?>>
        </td>
    </tr>
    <tr>
        <td class="name" style="width: 180px">
            <?php print Text::_('NAME_IN_SELECT')?>
        </td>
        <td>
            <input type="hidden" name="params[name_in_select]" value="0">
            <input type="checkbox" name="params[name_in_select]" value="1" <?php echo ($this->params['name_in_select'] ?? 0) ? 'checked' : '' ?>>
        </td>
    </tr>
    <tr>
        <td class="name" style="width: 180px">
            <?php print Text::_('Show selected attr in product')?>
        </td>
        <td>
            <label for="show_selected_attr_in_product1" class="me-4">
                <input id="show_selected_attr_in_product1" class="form-check-input" type="radio" name="params[show_selected_attr_in_product]" value="0" <?php echo (($this->params['show_selected_attr_in_product'] ?? 0) == 0) ? 'checked' : '' ?>> <?php echo Text::_('Hide')?>
            </label>
            <label for="show_selected_attr_in_product2" class="me-4">
                <input id="show_selected_attr_in_product2" class="form-check-input" type="radio" name="params[show_selected_attr_in_product]" value="1" <?php echo (($this->params['show_selected_attr_in_product'] ?? 0) == 1) ? 'checked' : '' ?>> <?php echo Text::_('Show selected attr as product link ')?>
            </label>
            <label for="show_selected_attr_in_product3">
                <input id="show_selected_attr_in_product3" class="form-check-input" type="radio" name="params[show_selected_attr_in_product]" value="2" <?php echo (($this->params['show_selected_attr_in_product'] ?? 0) == 2) ? 'checked' : '' ?>> <?php echo Text::_('Show selected attr using session')?>
            </label>

        </td>
    </tr>    
    </table>

    <legend><?php print Text::_("Hint")?></legend>
    <table class = "admintable" style="width: 100%">
    <?php foreach($attributes as $el){?>
        <?php foreach($languages as $lang){?>
            <tr>
                <td class="name" style="width: 180px">
                    <?php echo $el->name?> (<?php print $lang->name?>)
                </td>
                <td>
                    <textarea name="params[attribut][<?php print $el->attr_id?>][<?php print $lang->language?>]" rows="8" cols="80" style="width:100%;max-width: 500px;"><?php
                        print $this->params['attribut'][$el->attr_id][$lang->language] ?? '';
                    ?></textarea>
                </td>
            </tr>
        <?php }?>
    <?php }?>

    <?php foreach($exfields as $el){?>
        <?php foreach($languages as $lang){?>
            <tr>
                <td class="name" style="width: 180px">
                    <?php echo $el->name?> (<?php print $lang->name?>)
                </td>
                <td>
                    <textarea name="params[exfield][<?php print $el->id?>][<?php print $lang->language?>]" rows="8" cols="80" style="width:100%;max-width: 500px;"><?php
                        print $this->params['exfield'][$el->id][$lang->language] ?? ''
                    ?></textarea>
                </td>
            </tr>
        <?php }?>
    <?php }?>
    </table>
</fieldset>