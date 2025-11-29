
<fieldset class="form-horizontal">
    <div class="control-group">
        <div class="control-label">Product list Input quantity</div>
        <div class="controls">
            <select class="form-select" name="params[prod_list_input_qty]">
                <option value='0'>No</option>
                <option value='1' <?php echo (isset($this->params['prod_list_input_qty']) && $this->params['prod_list_input_qty'] == 1) ? "selected='selected'" : ""; ?>>Yes</option>
            </select>
        </div>
    </div>

    <div class="control-group">
        <div class="control-label">Delete all products</div>
        <div class="controls">
            <select class="form-select" name="params[delete_all_products]">
                <option value='0'>No</option>
                <option value='1' <?php echo (isset($this->params['delete_all_products']) && $this->params['delete_all_products'] == 1) ? "selected='selected'" : ""; ?>>Yes</option>
            </select>
        </div>
    </div>

</fieldset>

<style>
    .form-horizontal .control-label{
        width: 250px;
    }
    .form-horizontal .controls{
        margin-left: 10px;
        max-width: 200px;
    }
</style>