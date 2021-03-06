<?php
/**
 * @version    $Id$
 * @package    JSN_PowerAdmin_2
 * @author     JoomlaShine Team <support@joomlashine.com>
 * @copyright  Copyright (C) 2012 JoomlaShine.com. All Rights Reserved.
 * @license    GNU/GPL v2 or later http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Websites: http://www.joomlashine.com
 * Technical Support:  Feedback - http://www.joomlashine.com/contact-us/get-support.html
 */

// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// @formatter:off
?>
<form action="<?php echo JRoute::_('index.php?option=com_poweradmin2&view=about'); ?>" method="post" name="adminForm" id="adminForm">
	<div id="j-sidebar-container" class="span2">
		<?php echo JHtmlSidebar::render(); ?>
	</div>
	<div id="j-main-container" class="span10">
		<?php JsnExtFwHtml::renderAboutPage('com_poweradmin2', JUri::root(true) . '/plugins/system/poweradmin2/assets/img/logo-large.png'); ?>
	</div>
</form>
<?php
// Render header.
JsnExtFwHtml::renderHeaderComponent();

// Render footer.
JsnExtFwHtml::renderFooterComponent();
