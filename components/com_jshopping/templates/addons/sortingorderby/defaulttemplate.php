<div class="list_sort">
	<span
		class="active"><?php echo $this->sortingNames[$this->checkedSortingValue][$this->selectedOptionDataOrder]; ?></span>
	<ul>
		<?php foreach ($this->sortingNames as $key => $arrayNames): ?>
			<?php foreach ($arrayNames as $keyForNames => $name): ?>
				<li
					class="sortingOption<?php echo ($this->selectedOptionDataOrder == $keyForNames && $this->checkedSortingValue == $key) ? ' active' : ''; ?>"
					data-value="<?php echo $key; ?>" data-order="<?php echo $keyForNames; ?>">
					<?php echo $name; ?>
				</li>
			<?php endforeach; ?>
		<?php endforeach; ?>
	</ul>
	<div class="icon_sort">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
			<path
				d="M8.0001 10.9091C7.8761 10.9091 7.75198 10.8617 7.65731 10.767L2.80884 5.91858C2.61938 5.72912 2.61938 5.42234 2.80884 5.233C2.99829 5.04367 3.30508 5.04355 3.49441 5.233L8.0001 9.73869L12.5058 5.233C12.6952 5.04355 13.002 5.04355 13.1914 5.233C13.3807 5.42246 13.3808 5.72924 13.1914 5.91858L8.34288 10.767C8.24822 10.8617 8.1241 10.9091 8.0001 10.9091Z"
				fill="#60606F" style="fill:#60606F;fill:color(display-p3 0.3772 0.3772 0.4359);fill-opacity:1;" />
		</svg>
	</div>
</div>