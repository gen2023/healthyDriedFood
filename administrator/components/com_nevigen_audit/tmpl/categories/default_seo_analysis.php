<?php
/*
 * @package    Nevigen Audit Package
 * @version    1.2.0
 * @author     Nevigen.com - https://nevigen.com
 * @copyright  Copyright © Nevigen.com. All rights reserved.
 * @license    Proprietary. Copyrighted Commercial Software
 * @link       https://nevigen.com
 */

\defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

$linkList = 'index.php?option=com_nevigen_audit&view=categories';
?>
<h2 class="nevigen_auditor_stat_all d-flex align-items-center mb-3">
	<span class="nevigen_auditor_stat_name me-2"><?php echo Text::_('COM_NEVIGEN_AUDIT_CATEGORIES_AUDIT_STATISTIC_ALL'); ?></span>
	<span class="btn btn-warning"><?php echo $this->statistic['total'] ?></span>
</h2>
<div class="table-responsive">
	<table class="table table table-hover nevigen_auditor_remove_icon_link">
		<thead>
		<tr class="table-light">
			<th scope="col"></th>
			<?php foreach (array_keys($this->seoAnalysis['alias']) as $language) : ?>
				<th scope="col" class="text-center w-5">
					<?php echo Text::sprintf('COM_NEVIGEN_AUDIT_SEO_EMPTY_TITLE', $language); ?>
				</th>
			<?php endforeach; ?>
		</tr>
		</thead>
		<tbody>
		<?php foreach ($this->seoAnalysis as $name => $data) :
			if ($name === 'additional')
			{
				continue;
			}
			?>
			<tr class="nevigen_auditor_stat_value fs-3 ">
				<td>
					<?php echo Text::_('COM_NEVIGEN_AUDIT_SEO_ANALYSIS_' . $name); ?>
				</td>
				<?php foreach ($data as $lang => $count) : ?>
					<?php if ($count > 0) : ?>
						<td class="text-center">
							<div class="dropdown">
								<div class="btn bg-danger text-white fs-4">
									<?php echo $count; ?>
								</div>
							</div>
						</td>
					<?php else: ?>
						<td class="text-center text-success">
							<span class="btn btn-success">
								<?php echo Text::_('JNO'); ?>
							</span>
						</td>
					<?php endif; ?>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
</div>