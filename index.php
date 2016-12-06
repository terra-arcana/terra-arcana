<html style="margin-top: 0px !important;">
<head>
	<?php wp_head(); ?>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?php echo get_bloginfo('name') . ' | ' . get_bloginfo('description'); ?></title>
	<link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/favicon.ico" />
</head>
<body>
	<?php require_once('app/index.html'); ?>

	<?php wp_footer(); ?>
</body>
</html>
