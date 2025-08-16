<div class="filter_item <?php print $css_class?>">
    <label>
        <input type="radio" name="<?php print $name?>" value="<?php print $value->$field_id?>" <?php print $checked.$disabled?> onclick="jshop_filters_submit(<?php print $this->filter_number?>);"> 
        <span class="label-radio"></span>
        <?php if ($image && isset($value->$image) && $value->$image != ''){?>
            <span class="img"><img src="<?php print $imagedir.'/'.$value->$image?>" alt="<?php print htmlspecialchars($value->name);?>" title="<?php print htmlspecialchars($value->name);?>"></span>
        <?php }?>
        <span class="finame"><?php print $value->name?></span>
    </label>
</div>
