<!-- /* wordpress*********************************************************************** */
/* wordpress*********************************************************************** */
/* алгоритм действий*/ -->
1. ставим WP
2. перейти в параметры > чтение - и сделать одну из страниц главной (статическая страница)
3. генерим тему на underscores, копируем свои файлы
4. заливаем index.html в index.php
5. правим пути /* <?php bloginfo('template_directory'); ?> /css/styles.css */ / <?php echo get_template_directory_uri(); ?>/my/css/main.min.css
6. файлы стилей и js подключать в functions.php

function my_scripts() {
    wp_enqueue_style( 'my-style', get_template_directory_uri() . '/my/css/main.min.css' );

    wp_enqueue_script( 'my-script', get_template_directory_uri() . '/my/js/scripts.min.js', array(), '20151215', true );

    /* wp_enqueue_script( 'wordpresslp-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );
    
    wp_enqueue_script( 'wordpresslp-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );
    
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    } */
}
add_action( 'wp_enqueue_scripts', 'my_scripts' );

<!-- /* в functions.php ****************************************/
/* удалить стандартные линки в wp_head */ -->
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'wp_generator');
/* скрыть админ панель */
show_admin_bar(false);
<!-- /* функция сайдбара */ -->
function logo_widget_init() {
    register_sidebar(array(
        'name' => 'Логотип SVG',
        'id'   => 'logo',
        'before_widget' => '',
        'after_widget' => '',
        'before_title' => '<span class="notvisible">',
        'after_title' => '</span>'
    ));
}
<!-- /* вывести сайдбар в админ панели */ -->
add_action('widgets_init', 'logo_widget_init');
<!-- /* вывести в админ панели theme-options */ -->
require_once ( get_stylesheet_directory() . '/theme-options.php' );
<!-- /* вывести в посте(записи) возможность выбрать картинку */ -->
add_theme_support('post-thumbnails');
<!-- добавить дополнительный размер картинок, обрезка при загрузке, true означает жесткая обрезка, false - пропорциональная, но одна сторона будет равна заданному размеру -->
add_image_size('twentyseventeen-own-image', 250, 350, true);

<!-- /* в чанках ************************************************/
/* в index.php */ -->
<?php get_header(); ?>
<?php get_footer(); ?>
<!-- /* в header.php */ -->
<?php wp_head(); ?> <!-- в тег head -->
<!-- /* в footer.php */ -->
<?php wp_footer(); ?>

<!-- /* other ***************************************/ -->
<?php echo get_template_directory_uri(); ?> /* путь до директории */
<?php dynamic_sidebar('logo'); ?> /* вывести сайдбар в чанке */
<?php echo get_bloginfo('name'); ?> /* вывести название сайта */
<?php echo get_bloginfo('description'); ?> /* вывести описание сайта */
<?php echo get_cat_name(5); ?> /* вывести имя категории */
<?php echo category_description(7); ?> /* вывести описание категории */
<?php body_class(); ?> <!-- вывести классы у тега боди, можно вписать и свои -->

<!-- /* вывод записи(поста) */ -->
<?php if(have_posts()) : query_posts('p=1');

while (have_posts()) : the_post(); ?>
<?php the_title(); ?>
<?php the_content(); ?>
<?php the_date(); ?> <!-- если у постов одинаковая дата, то выведет только у одного поста -->
<?php echo get_the_date(); ?> <!-- выведет у всех постов -->
<?php the_author(); ?>
<?php the_post_thumbnail(array(100, 100)); ?>
<?php the_post_thumbnail('medium'); ?>

<?php endwhile; endif; wp_reset_query(); ?>

<!--вывод меню зарегистрированного в functions.php-->
<?php wp_nav_menu(array(
    'theme_location' => 'top', /*через область регистрации*/
    'container' => null, /*тег обертка*/
//   'items_wrap' => '<ul>%3$s</ul>' /*убирает шнягу из id*/
)); ?>
<?php wp_nav_menu(array(
    'menu' => 'верхнее', /*через название*/
    'container' => null, /*тег обертка*/
)); ?>
<?php wp_nav_menu(array(
    'menu' => 15, /*через ID*/
    'container' => null, /*тег обертка*/
)); ?>

<!-- вывод своего типа записи зарегистрированного в functions.php-->
<?php $posts = test_show_reviews(); ?>
    <h2>Отзывы</h2>
    <div class="reviews-box owl-carousel owl-theme">
    <?php foreach($posts as $post): ?>
        <div class="reviewItem">
            <div class="reviewItem__title"><?php echo $post->post_title; ?></div>
            <div class="reviewItem__content"><?php echo $post->post_content; ?></div>
        </div>
    <?php endforeach; ?>

<!-- /* вывод thumbnail(картинки) из поста со ссылкой на большой размер картинки*/ -->
<?php if (has_post_thumbnail()) : ?>
    <a href="<?php $large_image_url=wp_get_attachment_image_src(get_post_thumbnail_id(), 'large'); echo $large_image_url[0] ?>  /* <?php the_permalink(); */ ?>" title="<?php the_title_attribute(); ?>"><?php the_post_thumbnail(array(100, 100)); ?></a>
<?php endif; ?>

<!-- /* вывод категории(рубрики) и дополнительных полей */ -->
<?php if(have_posts()) : query_posts('cat=3');
    while (have_posts()) : the_post(); ?>
        <li><a href="<?php echo get_post_meta($post->ID, 'soc-url', true); ?>" target="_blank" title="<?php the_title(); ?>"><i class="fa <?php echo get_post_meta($post->ID, 'font-awesome', true); ?>"></i></a></li>
<? endwhile; endif; wp_reset_query(); ?>

<!-- вывод отдельного виджета *********************************-->
<?php $args = [
    'before_title' => '<p>',
    'after_title' => '</p>'
]; ?>

<?php the_widget('WP_Widget_Categories', 'title=Category', $args); ?>

<!-- /* вывод тега(метки) ****************************************************/ -->
<?php $tags=get_tags(); if ($tags) { foreach ($tags as $tag){ echo ''. $tag->name;} } ?> /* все теги */
<?php $tags=wp_get_post_tags($post->ID); if ($tags) { foreach ($tags as $tag){ echo ''. $tag->name;} } ?> /* конкретно у данной записи */

<!-- /* вывод поля из theme-options */ -->
<?php $options=get_option('sample_theme_options'); echo $options['phone-text'] ?>

<!-- /* вывод ID рубрики(категории) по ярлыку (нужно для импорта\экспорта тем) */ -->
<?php $idObj = get_category_by_slug('s-about');
    $id = $idObj->term_id; echo get_cat_name($id); ?>

<!-- **************************************************************************************************************** -->
<!-- **************************************************************************************************************** -->
<!-- плагины********************************************************************************************************* -->
Custom Field Suite - добавление обязательного поля к записи, странице
Contact Form 7 - формы обратной связи
Ninja Forms - формы обратной связи
YoastSeo - сео пак
All in one SEO Pack - сео пак
(SEO:
    h1, title, description;
    скорость загрузки;
    вес страницы и ресурсов;
    gzip сжатие;
    минификация;
    сжатие картинок;
    sitemap.xml;
    404 ошибка, если нет страницы(404.php, проверить htader(404));
    отсутствие дублей страниц.
), (gzip, cache - включить, если сервер не включает по дефолту; убить какую-нибудь страницу(радикальный метод) (в htaccess)
    <ifModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css #text/javascript application/javascript
    </ifModule>

    <filesMatch ".(css|jpg|jpeg|png|gif|js|ico)$">
        Header set Cache-Control "max-age=2628000, public"
    </filesMatch>

    <FilesMatch "wp-login.(php)$">
        #Deny From All
    </filesMatch>
)
WP Super Cache - кэширование страниц


<!-- создание плагина******************************************************************* -->
создаем папку с названием плагина в папке plugins

<?php

/*
Plugin Name: Заявки на квартиры
*/

register_activation_hook(__FILE__, 'flatsapp_install');
register_deactivation_hook(__FILE__, 'flatsapp_uninstall');
register_uninstall_hook(__FILE__, 'flatsapp_ondelete');

add_action('init', 'flatsapp_data');
add_action('wp_head', 'flatsapp_js_vars');
add_action('admin_menu', 'flatsapp_menu');

add_action('wp_ajax_flatapp', 'flatsapp_ajax');
add_action('wp_ajax_nopriv_flatapp', 'flatsapp_ajax');

function flatsapp_install(){
    
}

function flatsapp_uninstall(){
    
}

function flatsapp_ondelete(){
    
}

function flatsapp_js_vars(){
        $vars = array(
            'ajax_url' => admin_url('admin-ajax.php')
        );
        
        echo "<script>window.wp = " . json_encode($vars) . "</script>";
    }

function flatsapp_ajax(){
    /* проверки */
    
    $id_flat = (int)$_POST['flat_id'];
    $phone = htmlspecialchars($_POST['phone']);
    
    $data = [
        'post_type' => 'flatsapp',
        'post_status' => 'publish',
        'post_title' => $phone
    ];
    
    $id_post = wp_insert_post($data);
    
    add_post_meta($id_post, 'id_flat', $id_flat);
    add_post_meta($id_post, 'is_new', '1');
    
    $res = array(
        'success' => true
    );
    
    echo json_encode($res);
    
    wp_die();
}

function flatsapp_data(){ /*регистрация типа поста*/
    register_post_type('flatsapp', [
        'labels' => array(
            'name'               => 'Заявки на квартиры',
            'menu_name'          => 'Заявки на квартиры', 
        ),
        'public'              => true,
        'menu_position'       => 25,
        'menu_icon'           => 'dashicons-category', 
        'hierarchical'        => false,
        'supports'            => array('title', 'custom-fields')
    ]);
}

function flatsapp_menu(){ /*создание страницы в админке*/
    add_menu_page('Заявки', 'Заявки', 8, 'flatsapp', 'flatsapp_list');
}

function flatsapp_list(){ /*вывод заявок на странице Заявки*/
    echo "<h1>Список заявок</h1>";

    $str = '';
    
    $args = array(
        'orderby'     => 'date',
        'order'       => 'DESC',
        'post_type'   => 'flatsapp'
    );

    $posts = get_posts($args);
    global $post;

    $str .= "<table>";
    
    foreach($posts as $post){ 
        setup_postdata($post);
        
        $title = get_the_title();
        $dt = get_the_date();
        
        $meta = get_post_custom($post->ID);

        $str .= "<tr>
                    <td><em>$dt</em></td>
                    <td><strong>$title</strong></td>
                    <td><strong>{$meta['id_flat'][0]}</strong></td>
                    <td><strong>{$meta['is_new'][0]}</strong></td>
                </tr>";
    }

    $str .= "</table>";
    
    wp_reset_postdata(); 
    
    echo $str;
} ?>


<?php
/************************************
 * WebForMyself**********************
 ***********************************/

/*плагины********************************************************************************************************/
/*уроки: 1 - 3***************************************************************************************************/
/*процедурно*************************************/
register_activation_hook(__FILE__, 'jt_activate'); /*хук на активацию плагина*/

function jt_activate() {
    /*wp_mail(get_bloginfo('admin_email'), 'Плагин активирован', 'Произошла успешная активация плагина');*/ /*отправка письма на почту админа*/

    if (version_compare(PHP_VERSION, '5.7.0', '<')) {
        header('Content-type: text/html; Charset=utf-8'); /*для кодировки, видимо в старых версиях WP*/
        exit('Для работы плагина нужна версия выше');
    }
}
/*ООП********************************************/
class JTActivate {
    function __construct() {
        register_activation_hook( __FILE__, array( $this, 'jt_activate' ) ); /*хук на активацию плагина*/
    }

    function jt_activate() {
        $date = '[' . date('Y-m-d H:i:s') . ']'; /*[дата]*/
        error_log($date . " Плагин активирован\r\n", 3, dirname(__FILE__) . '/jt_errors_log.log'); /*создает файл лога
    и записывает в него, с переносом строки \r\n*/
    }
}
$jtActivate = new JTActivate(); /*создает экземпляр класса*/

class JTActivate {
    static function jt_activate() { /*без создания экземпляра класса, static обязательно*/
        $date = '[' . date('Y-m-d H:i:s') . ']'; /*[дата]*/
        error_log($date . " Плагин активирован\r\n", 3, dirname(__FILE__) . '/jt_errors_log.log'); /*создает файл лога
    и записывает в него, с переносом строки \r\n*/
    }
}

register_activation_hook( __FILE__, array( 'JTActivate', 'jt_activate' ) ); /*хук на активацию плагина, JTActive вместо $this*/

/*уроки: 4 - 6*****************************************************************************************************************************/
include __DIR__ . '/deactivate.php'; /*выносим функцию деактивации в отдельный файл deactivate.php*/

register_activation_hook(__FILE__, 'jt_activate'); /*хук на активацию плагина*/
register_deactivation_hook(__FILE__, 'jt_deactivate'); /*хук на деактивацию плагина*/
/*register_uninstall_hook(__FILE__, 'jt_uninstall');*/ /*хук на удаление плагина, удаление рекомендуется поизводить через uninstall.php(хук при этом вешать ненадо)*/

function jt_activate() {
    wp_mail(get_bloginfo('admin_email'), 'Плагин активирован', 'Произошла успешная активация плагина'); /*отправка письма на почту админа*/
}

function jt_uninstall() {
    wp_mail(get_bloginfo('admin_email'), 'Плагин удален', 'Произошло успешное удаление плагина '); /*отправка письма на почту админа*/
}

if (!defined('WP_UNINSTALL_PLUGIN')) /*проверка чтобы недопустить неавторизованного удаления плагина(в uninstall.php)*/
    exit;
wp_mail(get_bloginfo('admin_email'), 'Плагин удален', 'Произошло успешное удаление плагина '); /*отправка письма на почту админа*/
/********************************************************************************************************************************/
add_filter('the_title', 'title_function'); /*вешаем фильтр на хук заголовка*/
//add_filter('the_title', 'ucwords'); /*вешаем фильтр на хук заголовка, если callback без параметров, можно сразу вписывать сюда*/

function title_function($title) {
//  return ucwords($title); /*делает заглавные первые буквы слов(только латиница)*/

    if (is_admin()) return $title; /*если находимся на странице админки, то выводим заголовок по умолчанию*/
    return mb_convert_case($title, MB_CASE_TITLE, "UTF-8"); /*делает заглавные первые буквы слов и для кириллицы*/
}

add_filter('the_content', 'jt_content'); /*вешаем фильтр на хук контента*/

function jt_content($content) {
    if (is_user_logged_in()) return $content; /*если пользователь авторизован, показываем контент*/
    return '<div class="jt-access"><a href="' . home_url() .'/wp_login.php">Авторизуйтесь для просмотра контента</a></div>';
}

add_action('comment_post', 'jt_comment_post'); /*вешаем хук на оставление комментария*/

function jt_comment_post() {
    wp_mail(get_bloginfo('admin_email'), 'Новый комментарий', 'На сайте появился новый комментарий'); /*отправка письма на почту админа*/
}
/*уроки: 7 - 9*****************************************************************************************************************************/
/*плагин похожие записи*/
add_filter('the_content', 'jt_related_posts');
add_action('wp_enqueue_scripts', 'loadScripts');

function loadScripts() { /*регистрация скриптов и стилей(можно и без регистрации в большинстве случаев)*/
    wp_register_script('jt_scripts', plugins_url('js/scripts.js', __FILE__), array('jquery'));
    wp_register_style('jt_style', plugins_url('css/jt-style.css', __FILE__));

    wp_enqueue_script('jt_scripts');
    wp_enqueue_style('jt_style');
}

function jt_related_posts($content) {
    if (!is_single()) return $content; /*если не на странице поста, то сразу возвращаем контент*/

    $id = get_the_ID(); /*получаем ид поста(записи)*/
    $categories = get_the_category($id); /*массив категорий(рубрик) поста*/

    foreach ( $categories as $category ) {
        $cats_id[] = $category->cat_ID; /*вытаскиваем ID категории*/
    }

    $related_posts = new WP_Query( /*объект WP_Query достает параметры из БД*/
        array('posts_per_page' => 5,
                    'category__in' => $cats_id,
                    'orderby' => 'rand', /*сортировка записей рандом*/
                    'post__not_in' => array($id) /*исключаем из выборки текущий пост*/
        )
    );

    if ($related_posts->have_posts()) {
        $content .= '<div class="related-posts"><h3>Возможно Вас заинтересуют эти записи:</h3>';

        while ($related_posts->have_posts()) {
            $related_posts->the_post();

            if (has_post_thumbnail()) {
                /*если есть изображение у записи выводим его(получаем ID, режем изображение 100х100)*/
                $img = get_the_post_thumbnail(get_the_ID(), array(100, 100), array('alt' => get_the_title(), 'title' => get_the_title()));
            }  else {
                /*если нет, выводим дефолтную картинку(plugins_url - путь до папки плагинов)*/
                $img = '<img src="' . plugins_url('img/no_img.jpg', __FILE__) . '" 
                alt="' . get_the_title() . '" title="' . get_the_title() . '" width="100" heigh="100">';
            }

            $content .= '<a href="' . get_the_permalink() . '">'. $img .'</a>';
        }

        $content .= '</div>';
        wp_reset_query(); /*используется для сброса результатов пользовательской выборки*/
    }

    return $content;
}
/*уроки: 10 - 12*****************************************************************************************************************************/
/*плагин количество просмотров статей*/
/*перед внесением изменений в базу данных лучше зделать бэкап*/

include __DIR__ . '/jt_check.php'; /*инклуд файла*/

register_activation_hook(__FILE__, 'jt_create_field');
add_filter('the_content', 'jt_post_views');
add_action('wp_head', 'jt_add_view');

function jt_create_field() {
    global $wpdb; /*глобальный объект работы с базой данных(обязателен)*/

    if (!jt_check_field('jt_views')) { /*если в БД не существует указанное поле, то создаем его(функция берется из jt_check.php)*/
        $query = "ALTER TABLE $wpdb->posts ADD jt_views INT NOT NULL DEFAULT '0'"; /*вставляем в существующую таблицу posts строку jt_views*/
        $wpdb->query($query);
    }
}

function jt_post_views($content){
    if (is_page()) return $content; /*если мы на странице то сразу возвращаем контент*/

    global $post; /*глобальный объект пост, тоже самое что и the_post(), используем так как находимся в функции*/

    $views = $post->jt_views; /*получаем поле из базы данных*/

        if (is_single()) $views += 1; /*если на странице поста то увеличиваем количество просмотров*/

    return $content . "<b>Количество просмотров: </b>" . $views;
}

function jt_add_view(){
    if (!is_single()) return; /*если не страница поста то возврат*/
    global  $post, $wpdb;
    $jt_id = $post->ID; /*получаем поле ID из БД*/
    $views = $post->jt_views + 1; /*получаем поле jt_views из БД и увеличиваем на 1*/
    $wpdb->update( /*обновляем БД*/
        $wpdb->posts,
        array('jt_views' => $views), /*обновляем значение jt_views в БД*/
        array('ID' => $jt_id) /*обновляем значение в БД*/
        );
}

/*в отдельный файл jt_check.php*/
function jt_check_field($column){
    global $wpdb; /*глобальный объект БД*/

    $fields = $wpdb->get_results("SHOW fields FROM $wpdb->posts", ARRAY_A); /*получаем массив полей таблицы posts из БД*/

    foreach ( $fields as $field ) {
        if ($field['Field'] == $column) {
            return true;
        }
    }
    return false;
}
/*уроки: 13 - 15*****************************************************************************************************************************/
/*плагин добавления каптчи к комментарию*/
add_filter('comment_form_default_fields', 'jt_captcha'); /*хук на создание дефолтных полей у формы*/
add_filter('preprocess_comment', 'jt_check_captcha'); /*хук на преддобавление коментария*/
add_filter('comment_form_field_comment', 'jt_captcha2'); /*хук на поле коментария в форме*/

function jt_captcha($fields){
    unset($fields['url']); /*удаляем стандартное поле из формы (сайт)*/
    /*$fields['captcha'] = '<p>
    <label for="captcha">Каптча <span class="required">*</span></label>
    <input type="checkbox" name="captcha" id="captcha">
</p>';*/
    return $fields;
}

function jt_check_captcha($commentdata){
    if (is_user_logged_in()) return $commentdata; /*если пользователь авторизован*/

    if (!isset($_POST['captcha'])) { /*если в глобальном объекте есть каптча*/
        wp_die('<b>Ошибка:</b> да вы, батенька, бот, не иначе.'); /*выводим сообщение*/
    }
    return $commentdata;
}

function jt_captcha2($comment_field){
    if (is_user_logged_in()) return $comment_field;
    $comment_field .= '<p> <!--размещаем капчу после поля ввода комментария-->
    <label for="captcha">Каптча <span class="required">*</span></label>
    <input type="checkbox" name="captcha" id="captcha">
</p>';
    return $comment_field;
}
/*плагин добавления каптчи к форме авторизации*/
add_action('login_form', 'jt_captcha_login'); /*хук на форму авторизации*/
add_action('authenticate', 'jt_auth_sign', 30, 3); /*хук на авторизацию*/

function jt_auth_sign($user, $username, $password){
    if (isset($_POST['check']) && $_POST['check'] == 'check') { /*если в глобальном объекте POST есть check*/
        $user = new WP_Error('broke', '<b>Ошибка:</b> вы бот?'); /*присваиваем user новую ошибку и возвращаем user*/
    }
    if (isset($user->errors['invalid_username']) || isset($user->errors['incorrect_password'])) { /*если неверно введен логин или пароль возвращаем ошибку*/
        return new WP_Error('broke', '<b>Ошибка:</b> неверный логин/пароль');
    }
    return $user;
}

function jt_captcha_login(){
    echo '<p><label for="check"><input type="checkbox" name="check" id="check" value="check" checked>Снимите галочку</label></p>';
}
/*уроки: 16 - 17*****************************************************************************************************************************/
/*плагин хлебные крошки для заголовка*/
/*в тег title вставить <?php wp_title() ?>*/
add_filter( 'wp_title', 'wfm_title', 10);

function wfm_title($title){
    $title = null;
    $sep = ' + ';
    $site = get_bloginfo( 'name' );

    // главная страница
    if( is_home() || is_front_page() ){
        $title = array($site);
    }

    // постоянная страница
    elseif( is_page() ){
        $title = array( get_the_title(), $site );
    }

    // метка
    elseif( is_tag() ){
        $title = array( single_tag_title( 'Метка: ', false ), $site );
    }

    // поиск
    elseif( is_search() ){
        $title = array( 'Результаты поиска по запросу: ' . get_search_query() );
    }

    // 404
    elseif( is_404() ){
        $title = array('Страница не найдена');
    }

    //category
    elseif (is_category()) {
        $cat_id = get_query_var('cat'); /*ID категории*/
        $cat = get_category($cat_id); /*данные категории*/
        if ($cat->parent) {
            /*если есть родительская категория*/
            $categories = rtrim(get_category_parents($cat_id, false, $sep), $sep);
            $categories = explode($sep, $categories);
            $title = array_reverse($categories);
            $title[] = $site;
        } else {
            /*если это самостоятельная категория*/
            $title = array($cat->name, $site);
        }
    }

    //пост(запись)
    elseif (is_single()) {
        $category = get_the_category(); /*массив данных о категории*/
        $cat_id = $category[0]->cat_ID; /*ID катгории*/
        /*родительские категории(выводим только первую)*/
        $categories = rtrim(get_category_parents($cat_id, false, $sep), $sep);
        $categories = explode($sep, $categories);
        $categories[] = get_the_title();
        $title = array_reverse($categories);
        $title[] = $site;
    }

    // архив
    elseif( is_archive() ){
        $title = array( 'Архив за: ' . get_the_time("F Y"), $site );
    }

    $title = implode($sep, $title);
    return $title;
}
/*уроки: 18 - 21*****************************************************************************************************************************/
/*создание шорткодов*/
add_shortcode('test', 'jt_test');

function jt_test($atts, $content){
    /*$content = !empty($content) ? $content : 'Тестовые данные';*/
    /*$user = isset($atts['user']) ? $atts['user'] : 'Name';*/
    /*$login = isset($atts['login']) ? $atts['login'] : 'Login';*/
    $atts = shortcode_atts(
        array(
            'user' => 'Name',
            'login' => 'Login',
            'content' => !empty($content) ? $content : 'Тестовые данные'
        ), $atts
    );
    extract($atts); /*переводит элементы массива в переменные по ключам(без этого $atts['user'])*/
    return "<h3>{$content}</h3><p>Привет, {$user}! Ваш логин: {$login}</p>";

//  [test user="Jban" login="1234"]Yoyoyoy[/test] вывод в админке
}
/***************************************************************************************************************************************/
add_shortcode('map', 'jt_map');

function jt_map($atts, $content){
    $atts = shortcode_atts(
        array(
            'center' => 'Brooklyn Bridge,New York,NY',
            'width' => 600,
            'height' => 300,
            'zoom' => 13,
            'content' => !empty($content) ? "<h2>$content</h2>" : "<h2>Карта от гугл</h2>"
        ), $atts
    );
    $atts['size'] = $atts['width'] . 'x' . $atts['height'];
    $atts['center'] = str_replace(' ', '+', $atts['center']); /*заменяем пробелы на +*/
    extract($atts);

    $map = $content;
//    $map .= '<img src="http://maps.googleapis.com/maps/api/staticmap?center=' . $center . '&zoom=' . $zoom . '&size=' . $size . '&sensor=false&key=AIzaSyDW_Z35GFyB6Eph2m444rZe5GltzVLdZ1I" alt="">';
    $map .= '<img src="https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=600x300&maptype=roadmap
&markers=color:blue%7Clabel:S%7C40.702147,-74.015794&markers=color:green%7Clabel:G%7C40.711614,-74.012318
&markers=color:red%7Clabel:C%7C40.718217,-73.998284
&key=AIzaSyDW_Z35GFyB6Eph2m444rZe5GltzVLdZ1I" alt="">';
    return $map;

//  [map width="600" height="300" zoom="13"]Орисание карты[/map] сам шорткод, выводим в админке
}
/************************************************************************************************************************/
add_shortcode('map', 'jt_maps');

$jt_maps_arr = array();

function jt_maps($atts){
    global $jt_maps_arr;
    $atts = shortcode_atts(
        array(
            'cords1' => 50.447312,
            'cords2' => 30.526511,
            'zoom' => 8
        ), $atts
    );
    extract($atts);
    $jt_maps_arr = array( /*делаем этот массив глобальным чтобы видеть его в другой функции и передаем туда значения*/
        'cords1' => $cords1,
        'cords2' => $cords2,
        'zoom' => $zoom
    );
    add_action('wp_footer', 'jt_load_scripts'); /*добавляем внутри функции, чтобы скрипты грузились только на странице вызова шорткода*/
    return '<div id="map" style="width: 650px; height: 400px;"></div>';
}

function jt_load_scripts(){
    global $jt_maps_arr;
    wp_register_script('jt-maps-google', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCnL8F3DAXoKybTAR-hMtt4eoXzKGTN0fk', [], null);
    wp_register_script('jt-maps', plugins_url('jt_maps.js', __FILE__));

    wp_enqueue_script('jt-maps-google');
    wp_enqueue_script('jt-maps');

    wp_localize_script('jt-maps', 'jtObj', $jt_maps_arr); /*предоставляет доступ к объекту jtObj в jt_maps.js*/

//  [map cords1="50.447312" cords2="30.526511" zoom="17"] шорткод
}
/*JS*/
var map;
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: parseFloat(jtObj.cords1), lng: parseFloat(jtObj.cords2)},
        zoom: parseInt(jtObj.zoom)
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
/*уроки: 22 - 23*****************************************************************************************************************************/
/*плагин галереи*/
remove_shortcode( 'gallery' ); /*удаляем шорткод с галереи, так как может выполняться только одна функция обработчик*/
add_shortcode( 'gallery', 'jt_gallery' );
add_action('wp_enqueue_scripts', 'jt_load_scripts');

function jt_load_scripts(){
    wp_register_script('jt-lightbox-js', plugins_url('js/lightbox.min.js', __FILE__), array('jquery'));
    wp_register_style('jt-lightbox-css', plugins_url('css/lightbox.css', __FILE__));

    wp_enqueue_script('jt-lightbox-js');
    wp_enqueue_style('jt-lightbox-css');
}

function jt_gallery($atts){
    $img_id = explode(',', $atts['ids']); /*разбивает строку с помощью разделителя(тут запятая) и возвращает массив*/
    if( !$img_id[0] ) return '<div class="jt-gallery">В галерее нет картинок</div>'; /*если в массиве на нулевой позиции ничего нет*/
    $html = '<div class="jt-gallery">';
    foreach($img_id as $item){
        $img_data = get_posts( array(
            'p' => $item, /*параметр записей и страниц*/
            'post_type' => 'attachment'
        ) );
//      print_r($img_data);

        $img_desc = $img_data[0]->post_content;
        $img_caption = $img_data[0]->post_excerpt;
        $img_title = $img_data[0]->post_title;
        $img_thumb = wp_get_attachment_image_src( $item, 'thumbnail' ); /*получаем миниатюру*/
        $img_full = wp_get_attachment_image_src( $item, 'full' ); /*получаем большую картинку*/
        /*выводим галерею с плагином jQuery - lightbox(popup)*/
        $html .= "<a href='{$img_full[0]}' data-lightbox='gallery' data-title='{$img_caption}'><img src='{$img_thumb[0]}' width='{$img_thumb[1]}' height='{$img_thumb[2]}' alt='{$img_title}'></a>";
    }
    $html .= '</div>';
    return $html;
}

/***********************************************************************************************************************/
/***********************************************************************************************************************/
/*виджеты***************************************************************************************************************/
/*уроки: 1 - 2*****************************************************************************************************************************/
/*создание простейшего виджета*/
add_action( 'widgets_init', 'jt_first_widget' );

function wfm_first_widget(){
    register_widget( 'JT_Widget' ); /*регистрируем виджет*/
}

class JT_Widget extends WP_Widget{

    function __construct(){
        /*parent::__construct(
            // ID, name, args (description)
            'wfm_fw',
            'Мой первый виджет',
            array( 'description' => 'Описание виджета' )
        );*/
        $args = array(
            'name' => 'Мой первый виджет',
            'description' => 'Описание виджета',
            'classname' => 'jt-test'
        );
        parent::__construct('jt_fw', '', $args); /*вызываем конструктор родителя и передаем параметры*/
    }

    function widget($args, $instance){ /*то, как виджет будет выглядеть в верстке*/
        extract($args);
        extract($instance);

        $title = apply_filters( 'widget_title', $title );
        $text = apply_filters( 'widget_text', $text );

        echo $before_widget;
        echo $before_title . $title . $after_title;
        echo "<div>$text</div>";
        echo $after_widget;
    }

    function form($instance){ /*функция для назначения внешнего вида виджета в админке*/
        extract($instance);
        ?>

        <p>
            <label for="<?php echo $this->get_field_id('title') ?>">Заголовок:</label> <!--$this обращается к class JT_Widget; функция esc_attr очищает строку для вывода в значениях HTML атрибутов-->
            <input type="text" name="<?php echo $this->get_field_name('title') ?>" id="<?php echo $this->get_field_id('title') ?>" value="<?php if( isset($title) ) echo esc_attr( $title ); ?>" class="widefat">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id('text') ?>">Текст:</label>
            <textarea class="widefat" name="<?php echo $this->get_field_name('text') ?>" id="<?php echo $this->get_field_id('text') ?>" cols="20" rows="5"><?php if( isset($text) ) echo esc_attr( $text ); ?></textarea>
        </p>

        <?php
    }

    function update($new_instance, $old_instance){ /*функция обновления введенных данных, например вырезать теги или заменить строки*/
        $new_instance['title'] = !empty($new_instance['title']) ? strip_tags($new_instance['title']) : '';
        $new_instance['text'] = str_replace('<p>', '', $new_instance['text']);
        $new_instance['text'] = str_replace('</p>', '<br>', $new_instance['text']);
        return $new_instance;
    }

}

/*уроки: 3 - 6*****************************************************************************************************************************/
/*виджет рубрики: аккордион*/
add_action( 'widgets_init', 'jt_cats' );

function jt_cats() {
    register_widget( 'JT_Cats' );
}

class JT_Cats extends WP_Widget {

    public $jt_cats_array;

    function __construct() {
        $args = array(
            'name'        => 'Рубрики: Аккордеон',
            'description' => 'Виджет выводит меню категорий в виде аккордеона'
        );
        parent::__construct( 'jt_cats', '', $args );
    }

    function form( $instance ) {
        extract( $instance );
        $title      = ! empty( $title ) ? esc_attr( $title ) : '';
        $eventType  = isset( $eventType ) ? $eventType : 'hover';
        $hoverDelay = isset( $hoverDelay ) ? $hoverDelay : 100;
        $speed      = isset( $speed ) ? $speed : 400;
        $exclude    = isset( $exclude ) ? $exclude : '';
        ?>

        <p>
            <label for="<?php echo $this->get_field_id( 'title' ) ?>">Заголовок:</label>
            <input type="text" name="<?php echo $this->get_field_name( 'title' ) ?>"
                         id="<?php echo $this->get_field_id( 'title' ) ?>" value="<?php echo $title ?>" class="widefat">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'eventType' ) ?>">Способ раскрытия:</label>
            <select class="widefat" name="<?php echo $this->get_field_name( 'eventType' ) ?>"
                            id="<?php echo $this->get_field_id( 'eventType' ) ?>">
                <option value="click" <?php selected( 'click', $eventType, true ); ?>>По клику</option>
                <option value="hover" <?php selected( 'hover', $eventType, true ); ?>>При наведении</option>
            </select>
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'hoverDelay' ) ?>">Пауза перед раскрытием(в мс):</label>
            <input type="text" name="<?php echo $this->get_field_name( 'hoverDelay' ) ?>"
                         id="<?php echo $this->get_field_id( 'hoverDelay' ) ?>" value="<?php echo $hoverDelay ?>" class="widefat">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'speed' ) ?>">Скорость раскрытия (в мс):</label>
            <input type="text" name="<?php echo $this->get_field_name( 'speed' ) ?>"
                         id="<?php echo $this->get_field_id( 'speed' ) ?>" value="<?php echo $speed ?>" class="widefat">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'exclude' ) ?>">Исключить указанные категории (ID):</label>
            <input type="text" name="<?php echo $this->get_field_name( 'exclude' ) ?>"
                         id="<?php echo $this->get_field_id( 'exclude' ) ?>" value="<?php echo $exclude ?>" class="widefat">
        </p>

        <?php
    }

    function widget( $args, $instance ) {
        extract( $args );
        extract( $instance );

        $this->jt_cats_array = array(
            'eventType'  => $eventType,
            'hoverDealy' => $hoverDealy,
            'speed'      => $speed
        );

        add_action( 'wp_footer', array( $this, 'jt_load_scripts' ) );

        $title = apply_filters( 'widget_title', $title );

//      add_filter('wp_list_categories', array($this, 'jt_remove_title')); /*фильтр на список категорий*/

        $cats = wp_list_categories(
            array(
                'title_li' => '', /*по умолчанию заголовок будет выводиться элементом списка li*/
                'echo'     => false, /*отменяем моментальный вывод*/
                'exclude' => $exclude /*исключает определенные категории*/
            )
        );

//      $cats = preg_replace('#title="[^"]+"#', '', $cats); //удалит только у нашей категории, добавленной виджетом

        $html = $before_widget;
        $html .= $before_title . $title . $after_title;
        $html .= '<ul class="accordion">';
        $html .= $cats;
        $html .= '</ul>';
        $html .= $after_widget;
        echo $html;
    }

    function update( $new_instance, $old_instance ) {
        $new_instance['title']      = ! empty( $new_instance['title'] ) ? strip_tags( $new_instance['title'] ) : '';
        $new_instance['eventType']  = ( $new_instance['hoverDelay'] == 'click' ) ? 'click' : 'hover';
        $new_instance['hoverDelay'] = ( (int) $new_instance['hoverDelay'] ) ? $new_instance['hoverDelay'] : 100;
        $new_instance['speed']      = ( (int) $new_instance['speed'] ) ? $new_instance['speed'] : 400;
        $new_instance['exclude']      = ! empty( $new_instance['exclude'] ) ? $new_instance['exclude'] : '';

        return $new_instance;
    }

    function jt_load_scripts() {
        wp_register_script( 'jt-cookie', plugins_url( 'js/jquery.cookie.js', __FILE__ ), array( 'jquery' ) );
        wp_register_script( 'jt-hoverIntent', plugins_url( 'js/jquery.hoverIntent.minified.js', __FILE__ ), array( 'jt-cookie' ) );
        wp_register_script( 'jt-accordion', plugins_url( 'js/jquery.accordion.js', __FILE__ ), array( 'jt-hoverIntent' ) );
        wp_register_script( 'jt-scripts', plugins_url( 'js/jt-scripts.js', __FILE__ ), array( 'jt-accordion' ) );

        wp_enqueue_script( 'jt-scripts' );
        wp_localize_script( 'jt-scripts', 'jt_cats_obj', $this->jt_cats_array );
    }

    /*function jt_remove_title($str){ //функция удаления атрибута, устанрвленного по умолчанию, в моем случае не требуется(удалит у всех категорий)
        $str = preg_replace('#title="[^"]+"#', '', $str); //регулярное выражение замены атрибута title на пустоту
        return $str;
    }*/

}

/*уроки: 7 - 9*****************************************************************************************************************************/
/*виджет записи со стены вконтакте*/
add_action( 'widgets_init', 'jt_vk' );
add_action( 'wp_enqueue_scripts', 'jt_load_scripts' );

function jt_vk() {
    register_widget( 'JT_Vk' );
}

function jt_load_scripts() {
    wp_enqueue_style( 'jt-style-css', plugins_url( 'css/style.css', __FILE__ ) );
}

class JT_VK extends WP_Widget {
    public $title, $count;

    function __construct() {
        $args = array(
            'description' => 'Виджет получает записи со стены Вконтакте'
        );
        parent::__construct( 'jt_vk', 'Записи со стены Вконтакте', $args );
    }

    function form( $instance ) {
        extract( $instance );
        $title = ! empty( $title ) ? esc_attr( $title ) : '';
        $count = isset( $count ) ? $count : 3;
        ?>

        <p>
            <label for="<?php echo $this->get_field_id( 'title' ) ?>">Страница Вконтакте (ID или короткий адрес)</label>
            <input type="text" name="<?php echo $this->get_field_name( 'title' ) ?>"
                         id="<?php echo $this->get_field_id( 'title' ) ?>" value="<?php echo $title ?>" class="widefat">
        </p>

        <p>
            <label for="<?php echo $this->get_field_id( 'count' ) ?>">Кол-во записей (максимум 100)</label>
            <input type="text" name="<?php echo $this->get_field_name( 'count' ) ?>"
                         id="<?php echo $this->get_field_id( 'count' ) ?>" value="<?php echo $count ?>" class="widefat">
        </p>

        <?php
    }

    function widget( $args, $instance ) {
        extract( $args );
        extract( $instance );
        $title = '14546947';
        $count = 3;

        $this->title = $title;
        $this->count = $count;
        $data        = $this->jt_get_posts_vk();
//      var_dump( $data );

        if ( $data === false ) {
            $data = 'Ошибка';
        } elseif ( empty( $data ) ) {
            $data = 'Нет записей для вывода';
        }

        echo $before_widget;
        echo $before_title . "Записи со стены $title" . $after_title;
        echo $data;
        echo $after_widget;
    }

    function update( $new_instance, $old_instance ) {
        $new_instance['title'] = ! empty( $new_instance['title'] ) ? strip_tags( $new_instance['title'] ) : '';
        $new_instance['count'] = ( (int) $new_instance['count'] ) ? $new_instance['count'] : 5;

        return $new_instance;
    }

    private function jt_get_posts_vk() { /*$url - неправильно сформирован метод запроса(посмотреть в документации ВК)*/
        if ( is_numeric( $this->title ) ) {
            $id          = "owner_id={$this->title}";
            $this->title = "id{$this->title}";
        } else {
            $id = "domain={$this->title}";
        }
        if ( ! (int) $this->count ) {
            $this->count = 3;
        }
        $url      = "http://api.vk.com/method/wall.get?{$id}&filter=owner&count={$this->count}";
        $vk_posts = wp_remote_get( $url );
        $vk_posts = json_decode( $vk_posts['body'] );

        if ( isset( $vk_posts->error ) ) {
            return false;
        }

        $html = '<div class="jt-vk">';
        foreach ( $vk_posts->response as $item ) {
            if ( ! empty( $item->text ) ) {
                $text = $this->jt_substr( $item->text );
                $html .= "<div><a href='http://vk.com/{$this->title}'>{$text}</a></div>";
            } elseif ( ! empty( $item->attachment->photo->src_small ) ) {
                $html .= "<div><a href='http://vk.com/{$this->title}'><img src='{$item->attachment->photo->src_small}' alt=''></a></div>";
            }
        }
        $html .= '</div>';

        return $html;
    }

    private function jt_substr( $str ) {
        $str_arr  = explode( ' ', $str );
        $str_arr2 = array_slice( $str_arr, 0, 10 );
        $str      = implode( ' ', $str_arr2 );
        if ( count( $str_arr ) > 10 ) {
            $str .= '...';
        }

        return $str;
    }

}

/*в JS*/
jQuery(document).ready(function($) {
    $('ul.accordion').dcAccordion({
        eventType: jt_cats_obj.eventType,
        disableLink: false,
        hoverDelay: jt_cats_obj.hoverDelay,
        speed: jt_cats_obj.speed
    });
});

/***********************************************************************************************************************/
/***********************************************************************************************************************/
/*API настроек**********************************************************************************************************/
/*уроки: 1 - 4*****************************************************************************************************************************/
add_action('admin_init', 'jt_first_option');

function jt_first_option(){
    //$option_group, $option_name, $sanitize_callback
    register_setting(
        'general', /*страница, для которой регистрирцется опция*/
        'jt_first_option' /*название опции*/
    );
    //$id, $title, $callback, $page, $section, $args
    add_settings_field(
        'jt_first_option', /*ID опции(использовать для ИД поля формы)*/
        'Первая опция', /*заголовок*/
        'jt_first_cb', /*callback для html-кода поля формы*/
        'general' /*страница, для которой регистрируется опция*/
    );

    function jt_first_cb(){
        ?>

        <input type="text" name="jt_first_option" id="jt_first_option" value="<?php echo esc_attr(get_option('jt_first_option')); ?>" class="regular-text">

        <?php
    }
}
//выводить в теме - echo get_option('jt_first_option');
/*********************************************************************************************/
add_action( 'admin_init', 'jt_theme_options' );
add_action('wp_enqueue_scripts', 'jt_load_scripts');
register_uninstall_hook(__FILE__, 'jt_delete_options');

function jt_delete_options(){
    delete_option('jt_theme_options'); /*удаляем опцию из options.php при удалении плагина*/
}

function jt_load_scripts(){
    $jt_theme_options = get_option('jt_theme_options');
    wp_register_script('jt-options', plugins_url('js/common.js', __FILE__), array('jquery'));
    wp_enqueue_script('jt-options');
    wp_localize_script('jt-options', 'jtObj', $jt_theme_options);
}

function jt_theme_options() {
    register_setting( 'general', 'jt_theme_options' );
    //$id - ID секции
    //$title - заголовок
    //$callback - callback для генерации html кода
    //$page - для какой страницы регистрируется секция
    add_settings_section( 'jt_theme_section_id', 'Опции темы', 'jt_theme_options_section_cb', 'general' );
    add_settings_field( 'jt_theme_options_body', 'Цвет фона', 'jt_theme_body_cb', 'general', 'jt_theme_section_id' );
    add_settings_field( 'jt_theme_options_header', 'Цвет header', 'jt_theme_header_cb', 'general', 'jt_theme_section_id' );
}

function jt_theme_options_section_cb() {
    echo '<p>Описание секции</p>';
}

function jt_theme_body_cb() {
    $options = get_option( 'jt_theme_options' );
    ?>

    <input type="text" name="jt_theme_options[jt_theme_options_body]" id="jt_theme_options_body"
                 value="<?php echo esc_attr( $options['jt_theme_options_body'] ) ?>" class="regular-text">

    <?php
}

function jt_theme_header_cb() {
    $options = get_option( 'jt_theme_options' );
    ?>

    <input type="text" name="jt_theme_options[jt_theme_options_header]" id="jt_theme_options_header"
                 value="<?php echo esc_attr( $options['jt_theme_options_header'] ) ?>" class="regular-text">

    <?php
}
/*в JS*/
jQuery(document).ready(function ($) {
    if(jtObj.jt_theme_options_body) {
      $('body').css('background-color', jtObj.jt_theme_options_body);
    }
    if(jtObj.jt_theme_options_header) {
        $('header').css('background-color', jtObj.jt_theme_options_header);
    }
});
/*********************************************************************************************/
/*плагин галереи с опциями в админке*/
remove_shortcode( 'gallery' ); /*удаляем шорткод с галереи, так как может выполняться только одна функция обработчик*/
add_shortcode( 'gallery', 'jt_gallery' );
add_action('wp_enqueue_scripts', 'jt_scripts');
add_action('admin_init', 'jt_gallery_options');
register_uninstall_hook(__FILE__, 'jt_delete_options');

function jt_delete_options(){
    delete_option('jt_gallery_options'); /*удаляем опцию из options.php при удалении плагина*/
}

function jt_gallery_options(){ /*регаем секцию опций на главной странице опций(2 поля)*/
    register_setting('general', 'jt_gallery_options');
    add_settings_section('gallery_section_id', 'Опции галереи', '', 'general');
    add_settings_field('gallery_option_title', 'Название галереи', 'jt_gallery_title_cb', 'general', 'gallery_section_id');
    add_settings_field('gallery_option_text', 'Текст при отсутствии картинок', 'jt_gallery_text_cb', 'general', 'gallery_section_id');
}

function jt_gallery_title_cb(){
    $options = get_option( 'jt_gallery_options' ); /*получаем опции*/
    ?>

    <input type="text" name="jt_gallery_options[gallery_option_title]" id="gallery_option_title"
           value="<?php echo esc_attr( $options['gallery_option_title'] ) ?>" class="regular-text">

    <?php
}

function jt_gallery_text_cb(){
    $options = get_option( 'jt_gallery_options' );
    ?>

    <input type="text" name="jt_gallery_options[gallery_option_text]" id="gallery_option_text"
           value="<?php echo esc_attr( $options['gallery_option_text'] ) ?>" class="regular-text">

    <?php
}

function jt_scripts(){
    wp_register_script('jt-lightbox-js', plugins_url('js/lightbox.min.js', __FILE__), array('jquery'));
    wp_register_style('jt-lightbox-css', plugins_url('css/lightbox.css', __FILE__));

    wp_enqueue_script('jt-lightbox-js');
    wp_enqueue_style('jt-lightbox-css');
}

function jt_gallery($atts){
    $options = get_option('jt_gallery_options');
    $img_id = explode(',', $atts['ids']); /*разбивает строку с помощью разделителя(тут запятая) и возвращает массив*/
    if( !$img_id[0] ) return '<div class="jt-gallery"><h3>'. $options['gallery_option_title'] .'</h3>'. $options['gallery_option_text'] .'</div>'; /*если в массиве на нулевой позиции ничего нет*/
    $html = '<div class="jt-gallery"><h3>'. $options['gallery_option_title'] .'</h3>';
    foreach($img_id as $item){
        $img_data = get_posts( array(
            'p' => $item, /*параметр записей и страниц*/
            'post_type' => 'attachment'
        ) );
//      print_r($img_data);

        $img_desc = $img_data[0]->post_content;
        $img_caption = $img_data[0]->post_excerpt;
        $img_title = $img_data[0]->post_title;
        $img_thumb = wp_get_attachment_image_src( $item, 'thumbnail' ); /*получаем миниатюру*/
        $img_full = wp_get_attachment_image_src( $item, 'full' ); /*получаем большую картинку*/
        /*выводим галерею с плагином jQuery - lightbox(popup)*/
        $html .= "<a href='{$img_full[0]}' data-lightbox='gallery' data-title='{$img_caption}'><img src='{$img_thumb[0]}' width='{$img_thumb[1]}' height='{$img_thumb[2]}' alt='{$img_title}'></a>";
    }
    $html .= '</div>';
    return $html;
}
/*уроки: 5 - 8*****************************************************************************************************************************/
/*создание своей страницы опций************************************************************************************/
add_action( 'admin_menu', 'wfm_admin_menu' );
add_action( 'admin_init', 'wfm_admin_settings' );

function wfm_admin_settings() {
    // $option_group, $option_name, $sanitize_callback
    register_setting( 'wfm_theme_options_group', 'wfm_theme_options', 'wfm_theme_options_sanitize' );
    /*параметр page должен совпадать с menu_slug в add_options_page()*/
    // $id, $title, $callback, $page
    add_settings_section( 'wfm_theme_options_id', 'Секция Опции темы', '', 'wfm-theme-options' );
    /*параметр section должен совпадать с параметром ID в add_settings_section(), label_for в $args назначает label для поля, при клике на него поле получает фокус*/
    // $id, $title, $callback, $page, $section, $args
    add_settings_field( 'wfm_theme_options_body', 'Цвет фона', 'wfm_theme_body_cb', 'wfm-theme-options', 'wfm_theme_options_id', array( 'label_for' => 'wfm_theme_options_body' ) );
    add_settings_field( 'wfm_theme_options_header', 'Цвет header', 'wfm_theme_header_cb', 'wfm-theme-options', 'wfm_theme_options_id', array( 'label_for' => 'wfm_theme_options_header' ) );
}

function wfm_theme_body_cb() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <input type="text" name="wfm_theme_options[wfm_theme_options_body]" id="wfm_theme_options_body"
                 value="<?php echo esc_attr( $options['wfm_theme_options_body'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_header_cb() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <input type="text" name="wfm_theme_options[wfm_theme_options_header]" id="wfm_theme_options_header"
                 value="<?php echo esc_attr( $options['wfm_theme_options_header'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_options_sanitize( $options ) { /*функция для проверки(очистки) введенных данных в поля в админке*/
    $clean_options = array();
    foreach ( $options as $k => $v ) { /*так как у нас двухмерный массив(jt_theme_options[jt_theme_options_body]) используем такой цикл*/
        $clean_options[ $k ] = strip_tags( $v );
    }

    return $clean_options;
}

function wfm_admin_menu() { /*добавляем страницу опций*/
    //$page_title, $menu_title, $capability, $menu_slug, $function (в menu_slug можно использовать __FILE__, так как этот параметр должен быть уникальным)
    add_options_page( 'Опции темы (title)', 'Опции темы', 'manage_options', 'wfm-theme-options', 'wfm_option_page' );
}

function wfm_option_page() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <div class="wrap">
        <h2>Опции темы</h2>
        <p>Настройки темы плагина Options &amp; Settings API</p>
        <form action="options.php" method="post"> <!--данные отправляются на страницу options.php-->
            <?php settings_fields( 'wfm_theme_options_group' ); ?>
            <!--выводим option_group из register_setting() (выводит необходимые скрытые поля в форме)-->
            <?php do_settings_sections( 'wfm-theme-options' ); ?>
            <!--выводим поля заданные в add_settings_section(), add_settings_field()-->
            <?php submit_button(); ?>
        </form>
    </div>

    <?php
}

/*уроки: 9 - 12*****************************************************************************************************************************/
/*создание страницы меню, субменю************************************************************************************/
add_action( 'admin_menu', 'wfm_admin_menu' );
add_action( 'admin_init', 'wfm_admin_settings' );

function wfm_admin_settings() {
    // $option_group, $option_name, $sanitize_callback
    register_setting( 'wfm_theme_options_group', 'wfm_theme_options', 'wfm_theme_options_sanitize' );
    /*параметр page должен совпадать с menu_slug в add_options_page()*/
    // $id, $title, $callback, $page
    add_settings_section( 'wfm_theme_options_id', 'Секция Опции темы', '', 'wfm-theme-options' );
    /*параметр section должен совпадать с параметром ID в add_settings_section(), label_for в $args назначает label для поля, при клике на него поле получает фокус*/
    // $id, $title, $callback, $page, $section, $args
    add_settings_field( 'wfm_theme_options_body', 'Цвет фона', 'wfm_theme_body_cb', 'wfm-theme-options', 'wfm_theme_options_id', array( 'label_for' => 'wfm_theme_options_body' ) );
    add_settings_field( 'wfm_theme_options_header', 'Цвет header', 'wfm_theme_header_cb', 'wfm-theme-options', 'wfm_theme_options_id', array( 'label_for' => 'wfm_theme_options_header' ) );
}

function wfm_theme_body_cb() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <input type="text" name="wfm_theme_options[wfm_theme_options_body]" id="wfm_theme_options_body"
                 value="<?php echo esc_attr( $options['wfm_theme_options_body'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_header_cb() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <input type="text" name="wfm_theme_options[wfm_theme_options_header]" id="wfm_theme_options_header"
                 value="<?php echo esc_attr( $options['wfm_theme_options_header'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_options_sanitize( $options ) { /*функция для проверки(очистки) введенных данных в поля в админке*/
    $clean_options = array();
    foreach ( $options as $k => $v ) { /*так как у нас двухмерный массив(jt_theme_options[jt_theme_options_body]) используем такой цикл*/
        $clean_options[ $k ] = strip_tags( $v );
    }

    return $clean_options;
}

function wfm_admin_menu() { /*добавляем страницу опций*/
    //$page_title, $menu_title, $capability, $menu_slug, $function (в menu_slug можно использовать __FILE__, так как этот параметр должен быть уникальным),
    // $icon_url(иконка для меню, можно указать путь к своей иконке), $position(можно указать дробное число)
//  add_options_page( 'Опции темы (title)', 'Опции темы', 'manage_options', 'wfm-theme-options', 'wfm_option_page' );
    add_menu_page( 'Опции темы (title)', 'Опции темы', 'manage_options', 'wfm-theme-options', 'wfm_option_page', 'dashicons-smiley', '5.5' );
}

function wfm_option_page() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <div class="wrap">
        <h2>Опции темы</h2>
        <p>Настройки темы плагина Options &amp; Settings API</p>
        <form action="options.php" method="post"> <!--данные отправляются на страницу options.php-->
            <?php settings_fields( 'wfm_theme_options_group' ); ?>
            <!--выводим option_group из register_setting() (выводит необходимые скрытые поля в форме)-->
            <?php do_settings_sections( 'wfm-theme-options' ); ?>
            <!--выводим поля заданные в add_settings_section(), add_settings_field()-->
            <?php submit_button(); ?>
        </form>
    </div>

    <?php
}
/***************************************************************************************************/
/*пример с регистрацией двух опций*/
/*delete_option('wfm_theme_options_body');
delete_option('wfm_theme_options_header');*/
add_action( 'admin_menu', 'wfm_admin_menu' );
add_action( 'admin_init', 'wfm_admin_settings' );

function wfm_admin_settings() {
    // $option_group, $option_name, $sanitize_callback
    register_setting( 'wfm_group', 'wfm_theme_options_body', 'wfm_theme_options_sanitize' );
    register_setting( 'wfm_group', 'wfm_theme_options_header', 'wfm_theme_options_sanitize' );
    /*параметр page должен совпадать с menu_slug в add_menu_page(), тут необязательно у нас menu_slug - __FILE_, и будет непонятно к какой секции какое поле относится*/
    // $id, $title, $callback, $page
    add_settings_section( 'wfm_theme_body_id', 'Секция BODY Опции темы', '', 'wfm_body_id' );
    add_settings_section( 'wfm_theme_header_id', 'Секция HEADER Опции темы', '', 'wfm_header_id' );
    /*параметр section должен совпадать с параметром ID в add_settings_section(), label_for в $args назначает label для поля, при клике на него поле получает фокус*/
    // $id, $title, $callback, $page, $section, $args
    add_settings_field( 'wfm_setting_body_id', 'Цвет фона', 'wfm_theme_body_cb', 'wfm_body_id', 'wfm_theme_body_id',
        array( 'label_for' => 'wfm_setting_body_id' ) );
    add_settings_field( 'wfm_setting_header_id', 'Цвет header', 'wfm_theme_header_cb', 'wfm_header_id', 'wfm_theme_header_id',
        array( 'label_for' => 'wfm_setting_header_id' ) );
}

function wfm_theme_body_cb() {
    $options = get_option( 'wfm_theme_options_body' );
    ?>

    <input type="text" name="wfm_theme_options_body[body]" id="wfm_setting_body_id"
                 value="<?php echo esc_attr( $options['body'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_header_cb() {
    $options = get_option( 'wfm_theme_options_header' );
    ?>

    <input type="text" name="wfm_theme_options_header[header]" id="wfm_setting_header_id"
                 value="<?php echo esc_attr( $options['header'] ); ?>" class="regular-text">

    <?php
}

function wfm_admin_menu() { /*добавляем страницу опций*/
    //$page_title, $menu_title, $capability, $menu_slug, $function (в menu_slug можно использовать __FILE__, так как этот параметр должен быть уникальным),
    // $icon_url(иконка для меню, можно указать путь к своей иконке), $position(можно указать дробное число)
//  add_options_page( 'Опции темы (title)', 'Опции темы', 'manage_options', 'wfm-theme-options', 'wfm_option_page' );
    add_menu_page( 'Опции темы (title)', 'Опции темы', 'manage_options', __FILE__, 'wfm_option_page', 'dashicons-smiley', '5.5' );
}

function wfm_option_page() {
    $options = get_option( 'wfm_theme_options' );
    ?>

    <div class="wrap">
        <h2>Опции темы</h2>
        <p>Настройки темы плагина Options &amp; Settings API</p>
        <form action="options.php" method="post"> <!--данные отправляются на страницу options.php-->
            <?php settings_fields( 'wfm_group' ); ?>
            <!--выводим option_group из register_setting() (выводит необходимые скрытые поля в форме)-->
            <?php do_settings_sections( 'wfm_body_id' ); ?>
            <?php do_settings_sections( 'wfm_header_id' ); ?>
            <!--выводим поля заданные в add_settings_section(), add_settings_field()-->
            <?php submit_button(); ?>
        </form>
    </div>

    <?php
}

function wfm_theme_options_sanitize( $options ) { /*функция для проверки(очистки) введенных данных в поля в админке*/
    $clean_options = array();
    foreach ( $options as $k => $v ) { /*так как у нас двухмерный массив(jt_theme_options[jt_theme_options_body]) используем такой цикл*/
        $clean_options[ $k ] = strip_tags( $v );
    }

    return $clean_options;
}
/***************************************************************************************************/
add_action( 'admin_menu', 'wfm_admin_menu' );
add_action( 'admin_init', 'wfm_admin_settings' );

function wfm_admin_settings() {
    // $option_group, $option_name, $sanitize_callback
    register_setting( 'wfm_group_body', 'wfm_theme_options_body', 'wfm_theme_options_sanitize' );
    register_setting( 'wfm_group_header', 'wfm_theme_options_header', 'wfm_theme_options_sanitize' );
    /*параметр page должен совпадать с menu_slug в add_menu_page(), тут необязательно у нас menu_slug - __FILE_, и будет непонятно к какой секции какое поле относится*/
    // $id, $title, $callback, $page
    add_settings_section( 'wfm_theme_body_id', 'Секция BODY Опции темы', '', __FILE__ );
    add_settings_section( 'wfm_theme_header_id', 'Секция HEADER Опции темы', '', 'wfm-header-options' );
    /*параметр section должен совпадать с параметром ID в add_settings_section(), label_for в $args назначает label для поля, при клике на него поле получает фокус*/
    // $id, $title, $callback, $page, $section, $args
    add_settings_field( 'wfm_setting_body_id', 'Цвет фона', 'wfm_theme_body_cb', __FILE__, 'wfm_theme_body_id',
        array( 'label_for' => 'wfm_setting_body_id' ) );
    add_settings_field( 'wfm_setting_body_id2', 'Цвет шрифта', 'wfm_theme_body_cb2', __FILE__, 'wfm_theme_body_id',
        array( 'label_for' => 'wfm_setting_body_id2' ) );
    add_settings_field( 'wfm_setting_header_id', 'Цвет header', 'wfm_theme_header_cb', 'wfm-header-options', 'wfm_theme_header_id',
        array( 'label_for' => 'wfm_setting_header_id' ) );
    add_settings_field( 'wfm_setting_header_id2', 'Шрифт header', 'wfm_theme_header_cb2', 'wfm-header-options', 'wfm_theme_header_id',
        array( 'label_for' => 'wfm_setting_header_id2' ) );
}

function wfm_theme_body_cb() {
    $options = get_option( 'wfm_theme_options_body' );
    ?>

    <input type="text" name="wfm_theme_options_body[body]" id="wfm_setting_body_id"
                 value="<?php echo esc_attr( $options['body'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_body_cb2() {
    $options = get_option( 'wfm_theme_options_body' );
    ?>

    <input type="text" name="wfm_theme_options_body[color]" id="wfm_setting_body_id2"
                 value="<?php echo esc_attr( $options['color'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_header_cb() {
    $options = get_option( 'wfm_theme_options_header' );
    ?>

    <input type="text" name="wfm_theme_options_header[header]" id="wfm_setting_header_id"
                 value="<?php echo esc_attr( $options['header'] ); ?>" class="regular-text">

    <?php
}

function wfm_theme_header_cb2() {
    $options = get_option( 'wfm_theme_options_header' );
    ?>

    <input type="text" name="wfm_theme_options_header[color]" id="wfm_setting_header_id2"
                 value="<?php echo esc_attr( $options['color'] ); ?>" class="regular-text">

    <?php
}

function wfm_admin_menu() { /*добавляем страницу опций*/
    //$page_title, $menu_title, $capability, $menu_slug, $function (в menu_slug можно использовать __FILE__, так как этот параметр должен быть уникальным),
    // $icon_url(иконка для меню, можно указать путь к своей иконке), $position(можно указать дробное число)
//  add_options_page( 'Опции темы (title)', 'Опции темы', 'manage_options', 'wfm-theme-options', 'wfm_option_page' );
    add_menu_page( 'Опции темы (title)', 'Опции темы', 'manage_options', __FILE__, 'wfm_option_page', 'dashicons-smiley', '85.5' );
    /*создаем субстраницу*/
    add_submenu_page(__FILE__, 'Опции HEADER', 'Опции HEADER', 'manage_options', 'wfm-header-options', 'wfm_options_submenu');
}

function wfm_option_page() {
    ?>

    <div class="wrap">
        <h2>Опции темы</h2>
        <p>Настройки темы плагина. Секция BODY</p>
        <form action="options.php" method="post"> <!--данные отправляются на страницу options.php-->
            <?php settings_fields( 'wfm_group_body' ); ?>
            <!--выводим option_group из register_setting() (выводит необходимые скрытые поля в форме)-->
            <?php do_settings_sections( __FILE__ ); ?>
            <!--выводим поля заданные в add_settings_section(), add_settings_field()-->
            <?php submit_button(); ?>
        </form>
    </div>

    <?php
}

function wfm_options_submenu(){
    ?>

    <div class="wrap">
        <h2>Опции темы</h2>
        <p>Настройки темы плагина. Секция HEADER</p>
        <form action="options.php" method="post"> <!--данные отправляются на страницу options.php-->
            <?php settings_fields( 'wfm_group_header' ); ?>
            <!--выводим option_group из register_setting() (выводит необходимые скрытые поля в форме)-->
            <?php do_settings_sections( 'wfm-header-options' ); ?>
            <!--выводим поля заданные в add_settings_section(), add_settings_field()-->
            <?php submit_button(); ?>
        </form>
    </div>

    <?php
}

function wfm_theme_options_sanitize( $options ) { /*функция для проверки(очистки) введенных данных в поля в админке*/
    $clean_options = array();
    foreach ( $options as $k => $v ) { /*так как у нас двухмерный массив(jt_theme_options[jt_theme_options_body]) используем такой цикл*/
        $clean_options[ $k ] = strip_tags( $v );
    }

    return $clean_options;
}
/*уроки: 13 - 14*****************************************************************************************************************************/
/*загрузка файлов************************************************************************************/
add_action('admin_menu', 'jt_options_page');
add_action('admin_init', 'jt_setting');

function jt_options_page(){
    add_options_page('Опции темы', 'Опции темы', 'manage_options', 'jt-options-theme', 'jt_option_page');
}

function jt_setting(){
    register_setting('jt_options_group', 'jt_options_theme', 'jt_options_sanitize');
    add_settings_section('jt_options_section', 'Опции темы', '', 'jt-options-theme');
    add_settings_field('jt_body_bg_id', 'Цвет фона', 'jt_body_bg_cb', 'jt-options-theme', 'jt_options_section', array('label_for' => 'jt_body_bg_id'));
    add_settings_field('jt_header_pic_id', 'Картинка в шапке', 'jt_header_pic_cb', 'jt-options-theme', 'jt_options_section', array('label_for' => 'jt_header_pic_id'));
    add_settings_field('jt_check_pic_id', 'Удалить картинку', 'jt_check_pic_cb', 'jt-options-theme', 'jt_options_section', array('label_for' => 'jt_check_pic_id'));
}

function jt_body_bg_cb(){
    $options = get_option('jt_options_theme');
    ?>

    <input type="text" name="jt_options_theme[body_bg]" id="jt_body_bg_id" value="<?php echo esc_attr($options['body_bg']);?>" class="regular-text">

    <?php
}
function jt_header_pic_cb(){
    $options = get_option('jt_options_theme');
    ?>

    <input type="file" name="jt_options_theme_file" id="jt_header_pic_id">

    <?php
    $options = get_option('jt_options_theme');
    if (!empty($options['file'])) { /*если картинка загружена то выводим ее в админке*/
        echo "<p><img src='{$options['file']}' alt='' width='200'></p>";
    }
}

function jt_check_pic_cb(){
    ?>

    <input type="checkbox" name="jt_options_theme_file_check" id="jt_check_pic_id">

    <?php
}

function jt_options_sanitize($options){
    if (!empty($_FILES['jt_options_theme_file']['tmp_name'])) { /*если массив $_FILES содержит указанные поля*/
        $overrrides = array('test_form' => false); /*указывает что форма отправки не тестовая, а реальная*/
        $files = wp_handle_upload($_FILES['jt_options_theme_file'], $overrrides); /*функция загрузки файлов*/
    //  print_r($files);
        /*Array
    (
            [file] => C:\openserver\OpenServer\domains\wordpress.lavrik/wp-content/uploads/2017/12/templatemo_rss.png (можно использ. чтобы удалить файл с сервера)
            [url] => http://wordpress.lavrik/wp-content/uploads/2017/12/templatemo_rss.png
            [type] => image/png
    )*/
    $options['file'] = $files['url'];
    } else { /*если не содержит, то присваиваем старое значение 'file'*/
        $old_options = get_option('jt_options_theme');
        $options['file'] = $old_options['file'];
    }

    if (isset($_POST['jt_options_theme_file_check']) && $_POST['jt_options_theme_file_check'] == 'on') { /*если есть чекбокс и он нажат, то удаляем картинку из опций(не с сервера)*/
        unset($options['file']);
    }

    $clean_options = array(); /*очищаем поля, если надо*/
    foreach ( $options as $key => $v ) {
        $clean_options[$key] = strip_tags($v);
    }
    return $clean_options;
}

function jt_option_page(){
    ?>

    <div class="wrap">
        <h2>Опции темы</h2>
        <form action="options.php" method="post" enctype="multipart/form-data">
            <?php settings_fields('jt_options_group') ?>
            <?php do_settings_sections('jt-options-theme') ?>
            <?php submit_button() ?>
        </form>
    </div>

    <?php
}

?>

<!-- /* ************************************************************************************ */
/* ************************************************************************************ */
/* ************************************************************************************ */
/* Alethemes Framework / -->







<!-- /* ************************************************************************************ */
/* ************************************************************************************ */
/* своя страница настроек theme customizer (не theme options)*/ -->

<?php

/**
 * Добавление страницы настройки в админ-панель WordPress
 */
function example_customizer_menu() {
    add_theme_page( 'Customize', 'Customize', 'edit_theme_options', 'customize.php' );
}
add_action( 'admin_menu', 'example_customizer_menu' );

/**
 * Добавление индивидуальный секций, опций и элементов управления к настройщику тем
 * // получить все секции, настройки и контролы
    $wp_customize->sections();
    $wp_customize->settings();
    $wp_customize->controls();

    // позволяет получить компоненты по идентификатору
    $wp_customize->get_section( ‘id’ );
    $wp_customize->get_setting( ‘id’ );
    $wp_customize->get_control( ‘id’ );

    // Удаляет компоненты по идентификатору
    $wp_customize->remove_section( ‘id’ );
    $wp_customize->remove_setting( ‘id’ );
    $wp_customize->remove_control( ‘id’ );

    // Позволяет добавлять компоненты
    $wp_customize->add_section( ‘id’, array() );
    $wp_customize->add_setting( ‘id’, array() );
    $wp_customize->add_control( ‘id’, array() );
     */
function example_customizer( $wp_customize ) {
    $wp_customize->add_section( //добавление секции
        'example_section_one',
        array(
            'title' => 'Пример настроек',
            'description' => 'Это секция настроек.',
            'priority' => 35,
        )
    );
    //*****************************************************
    $wp_customize->add_setting( //добавление опции
        'copyright_textbox',
        array(
            'default' => 'Default copyright text',
            'sanitize_callback' => 'example_sanitize_text', //функция проверки текстового поля
        )
    );

    $wp_customize->add_control( //добавление контроллера
        'copyright_textbox',
        array(
            'label' => 'Copyright text',
            'section' => 'example_section_one',
            'type' => 'text', //текстовое поле
        )
    );
    //******************************************************
    $wp_customize->add_setting(
        'hide_copyright',
        array(
            'sanitize_callback' => 'example_sanitize_checkbox', //функция проверки чекбокса
        )
    );

    $wp_customize->add_control(
        'hide_copyright',
        array(
            'type' => 'checkbox', //чекбокс
            'label' => 'Hide copyright text',
            'section' => 'example_section_one',
        )
    );
    //******************************************************
    $wp_customize->add_setting(
        'logo_placement',
        array(
            'default' => 'left',
        )
    );

    $wp_customize->add_control(
        'logo_placement',
        array(
            'type' => 'radio', //радио баттон
            'label' => 'Logo placement',
            'section' => 'example_section_one',
            'choices' => array(
                                        'left' => 'Left',
                                        'right' => 'Right',
                                        'center' => 'Center',
            ),
        )
    );
    //******************************************************
    $wp_customize->add_setting(
        'powered_by',
        array(
            'default' => 'wordpress',
        )
    );

    $wp_customize->add_control(
        'powered_by',
        array(
            'type' => 'select', //список выбора
            'label' => 'Этот сайт работает благодаря:',
            'section' => 'example_section_one',
            'choices' => array(
                                        'wordpress' => 'WordPress',
                                        'hamsters' => 'Хомяках',
                                        'jet-fuel' => 'Реактивному топливу',
                                        'nuclear-energy' => 'Ядерной энергии',
            )
        )
    );
    //******************************************************
    $wp_customize->add_setting(
        'page-setting',
        array(
            'sanitize_callback' => 'example_sanitize_integer',
        )
    );

    $wp_customize->add_control(
        'page-setting',
        array(
            'type' => 'dropdown-pages', //список страниц
            'label' => 'Choose a page:',
            'section' => 'example_section_one',
        )
    );
    //******************************************************
    $wp_customize->add_setting(
        'color-setting',
        array(
            'default' => '#000000',
            'sanitize_callback' => 'sanitize_hex_color',
        )
    );

    $wp_customize->add_control(
        new WP_Customize_Color_Control( //выбор цвета
            $wp_customize,
            'color-setting',
            array(
                'label' => 'Color Setting',
                'section' => 'example_section_one',
                'settings' => 'color-setting',
            )
        )
    );
    //******************************************************
    $wp_customize->add_setting( 'file-upload' );

    $wp_customize->add_control(
        new WP_Customize_Upload_Control( //загрузка файла
            $wp_customize,
            'file-upload',
            array(
                'label' => 'Загрузка файлов',
                'section' => 'example_section_one',
                'settings' => 'file-upload'
            )
        )
    );
    //******************************************************
    $wp_customize->add_setting( 'img-upload' );

    $wp_customize->add_control(
        new WP_Customize_Image_Control( //загрузка изображения
            $wp_customize,
            'img-upload',
            array(
                'label' => 'Загрузка изображ.',
                'section' => 'example_section_one',
                'settings' => 'img-upload'
            )
        )
    );
    //******************************************************
    //Добавляет поддержку текстовой области в настройщик тем
    class Example_Customize_Textarea_Control extends WP_Customize_Control {
        public $type = 'textarea';

        public function render_content() {
            ?>
            <label>
                <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
                <textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
            </label>
            <?php
        }
    }

    $wp_customize->add_setting( 'textarea' );

    $wp_customize->add_control(
        new Example_Customize_Textarea_Control( //добавляет текстовую область
            $wp_customize,
            'textarea',
            array(
                'label' => 'Textarea',
                'section' => 'example_section_one',
                'settings' => 'textarea'
            )
        )
    );
    //******************************************************
    //Добавляет выбор цвета в существующую секцию цветов
    //Секции добавляемые автоматически самим WordPress-ом, определены в файле wp-includes/class-wp-customize-manager.php.
//  colors, header_image, background_image, static_front_page, custom_css, title_tagline
    $wp_customize->add_setting(
        'font-color',
        array(
            'default' => '#444444',
            'sanitize_callback' => 'sanitize_hex_color',
        )
    );

    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'font-color',
            array(
                'label' => 'Font Color',
                'section' => 'colors',
                'settings' => 'font-color'
            )
        )
    );
    //******************************************************
    //Использование AJAX для обновления предварительного просмотра
    $wp_customize->add_setting(
        'featured-background',
        array(
            'default' => '#ffffff',
            'sanitize_callback' => 'sanitize_hex_color',
            'transport' => 'postMessage',
        )
    );

    $wp_customize->add_control(
        new WP_Customize_Color_Control(
            $wp_customize,
            'featured-background',
            array(
                'label' => 'Featured Background',
                'section' => 'colors',
                'settings' => 'featured-background'
            )
        )
    );

    /*Этот код проверяет, имеет ли пользователь административные права и используется
    ли настройщик тем. Если обе проверки этих условий возвращают «true», тогда функция
    example_customize_preview() прикрепляется к wp_footer. Последний аргумент (21) —
    это просто приоритет, который дан этой функции. Он должен быть установлен значением больше 20 для правильной работы.*/
    if ( $wp_customize->is_preview() && ! is_admin() ) {
        add_action( 'wp_footer', 'example_customize_preview', 21);
    }

    /*Эта функция просто добавляет кусок кода javascript в подвал темы (и только тогда насройщик
    тем и используется). Она может служить вам базой для управления почти любыми типами данных настройщика,
    проходящих через AJAX. Код вверху делает в основном две вещи. Первая: он получает значение поля настройщика,
    когда оно изменяется (в этом примере это значение «featured-background», как можно увидеть в пятой строке).
    Вторая: он что-то делает с этим значением. Так как мы используем элемент ввода цвета, мы устанавливаем эту
    измененную величину цвета, как цвет фона элемента #featured (строка 7), используя функцию css() jQuery.*/
    function example_customize_preview() {
        ?>
        <script type="text/javascript">
            ( function( $ ) {
                wp.customize('featured-background',function( value ) {
                    value.bind(function(to) {
                        $('#featured').css('background-color', to );
                    });
                });
            } )( jQuery )
        </script>
        <?php
    }  // End function example_customize_preview()
    //******************************************************
    //Использование AJAX для предустановленных опций
    /*Для демонстрации мы будем менять встроенную опцию «Site Title» (Название сайта) так,
    чтобы она была передана настройщику тем, используя «postMessage«, а не как обычно, через
    «refresh«. Первое, мы добавляем следующую строку в главную функцию example_customizer(), созданную ранее:*/
    $wp_customize->get_setting('blogname')->transport='postMessage';
    /*Это обеспечит, что изменения значение этой опции будет передано предварительному просмотру через AJAX.
    Однако, для правильной работы надо, чтобы функция Javascript обработала значение, когда оно передается
    предварительному просмотру. Мы можем добавить этот код в функцию example_customize_preview(), которую мы
    создали на предыдущем шаге. Он просто обновляет текст привязки (анкор) внутри элемента «.site-name», когда значение меняется.*/

    /*wp.customize('blogname',function( value ) {
        value.bind(function(to) {
            $('.site-name a').html(to);
        });
    });*/

}
add_action( 'customize_register', 'example_customizer' );


/*Функция force_balance_tags() закрывает все незакрытые тэги, а функция wp_kses_post()
контролирует, чтобы только безопасные тэги попали в стандартную процедуру записи в БД в WordPress.*/
function example_sanitize_text( $input ) { //функция проверки текстового поля
    return wp_kses_post( force_balance_tags( $input ) );
}

function example_sanitize_checkbox( $input ) { //функция проверки флажка
    if ( $input == 1 ) {
        return 1;
    } else {
        return '';
    }
}

//array_key_exists проверяет, подходит ли введенное значение, сравнивая его с этим массивом
function example_sanitize_logo_placement( $input ) { //функция проверки радио баттон
    $valid = array(
        'left' => 'Left',
        'right' => 'Right',
        'center' => 'Center',
    );

    if ( array_key_exists( $input, $valid ) ) {
        return $input;
    } else {
        return '';
    }
}

function example_sanitize_powered_by( $input ) { //функция проверки выпадающего списка
    $valid = array(
        'wordpress' => 'WordPress',
        'hamsters' => 'Хомякам',
        'jet-fuel' => 'Реактивному топливу',
        'nuclear-energy' => 'Ядерной энергии',
    );

    if ( array_key_exists( $input, $valid ) ) {
        return $input;
    } else {
        return '';
    }
}

function example_sanitize_integer( $input ) { //функция проверки списка страниц, если значение number, то возвращаем
    if( is_numeric( $input ) ) {
        return intval( $input );
    }
}


/* вывод полей со страницы настроек */
/* ************************************************************** */
<?php if( get_theme_mod( 'hide_copyright' ) == '') { ?> /* если флажок (hide_copyright) не поставлен, выводим текстовое поле (copyright_textbox), если оно заполнено */
    &copy; <?php echo date('Y'); ?> <?php echo get_theme_mod( 'copyright_textbox', 'Пока нет никакой информации об авторских правах.' ); ?>
<?php } // end if ?>
/* ******************************************************** */
/* в зависимости от включенной радио баттон, позиционируем лого */
<?php
    $example_position = get_theme_mod( 'logo_placement' );
    if( $example_position != '' ) {
        switch ( $example_position ) {
            case 'left':
                // ничего не делать. Тема уже выровняла лого по левому краю
                break;
            case 'right':
                echo '<style type="text/css">';
                echo '#header #logo{ float: right; }';
                echo '</style>';
                break;
            case 'center':
                echo '<style type="text/css">';
                echo '#header{ text-align: center; }';
                echo '#header #logo{ float: none; margin-left: auto; margin-right: auto; }';
                echo '</style>';
                break;
        }
    }
?>
<!-- /* ************************************************************* */ -->
<!-- /* в зависимости от выбранного пункта в выпадающем списке подставляем значение */ -->
<p>This site is powered by <?php echo get_theme_mod( 'powered_by', 'WordPress' ); ?></p> 
<!-- /* ***************************************************************** */ -->


<!-- /* layers stylekit */ -->
<!-- Чтобы подготовить ваши кастомные стили для вашего StyleKit, просто скопируйте его в редактор и сохраните с именем css.txt.

Пример css.txt: css.txt
Экспорт контента

Наличие содержимого StyleKit в XML является важным условием в обеспечении комфортного импорта данных клиентом. Перед экспортом проверьте следующее:

StyleKit не имеет тэгов Post -> Tags.
Если ваш кит содержит демо посты, убедитесь, что любая из категорий, вами созданная соответствует вашему киту, в противном случае, создавайте только один с названием "Demo". Это сделает настройку и очистку содержания легче для конечного пользователя и снижает риск возникновения дубликатов.
Прочие страницы Layers не должны использовать именования, такие, как "Главная", "Портфолио", "Магазин", или "Блог" в тайтле заголовка.
Очистите корзину постов и страниц.
Удалите все комментарии.
Убедитесь, что все плагины отключены, чтобы избежать импорт лишних данных.

Если ваш StyleKit предназначен для коммерческого распространения, необходимо настроить демо на реальном сервере, прежде, чем экспортировать данные. Это гарантирует, что все изображения будут без проблем переданы на удаленный сервер.

Экспортируйте весь контент инструментом "Экспорт" в WordPress. Назовите файл экспорта your_kit-content.xml где your_kit это название StyleKit'а. Например: kittn-content.xml -->
<!-- Создайте файл Readme

Ваш ридми должен включать общую информацию о вас, как об авторе, смотреть пример ридми и некоторые основные инструкции по использованию. Вы можете скопировать readme.txt из примера и настроить под себя.
Структура готового StyleKit

    folder
    images
    css.txt
    layout-one.json
    layout-two.json
    kit_name-content.xml
    readme.txt

Что еще нужно не забыть сделать:

    Протестируйте ваш кит на свежей WordPress.
    Упакуйте ваш кит в Zip архив и именуйте его следующим образом: kitname_layers-style-kit.zip -->
