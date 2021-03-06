<?php
/**
* @package		EasySocial
* @copyright	Copyright (C) 2010 - 2013 Stack Ideas Sdn Bhd. All rights reserved.
* @license		GNU/GPL, see LICENSE.php
* EasySocial is free software. This version may have been modified pursuant
* to the GNU General Public License, and as distributed it includes or
* is derivative of works licensed under the GNU General Public License or
* other free or open source software licenses.
* See COPYRIGHT.php for copyright notices and details.
*/
defined( '_JEXEC' ) or die( 'Unauthorized Access' );
?>
<div data-field-joomla_email>
	<input type="text" size="30" class="input input-xlarge" id="email" name="email" value="<?php echo $email; ?>"
	data-check-required
	data-field-email-input
	placeholder="<?php echo $field->get( 'default' );?>" />
</div>
