<?php
defined('_JEXEC') or die;

class filterExtCache {

    private static $instances = [];
    private $max_time = 7 * 24 * 60 * 60;
    private $enabled = 1;    

    public static function getInstance(){
        $cls = static::class;
        if (!isset(self::$instances[$cls])) {
            self::$instances[$cls] = new static();
        }
        return self::$instances[$cls];
    }

    public function getCacheName($name, $params) {
        $res = $name.'-';
        $res .= md5(serialize($params));
        return $res;
    }

    public function setEnabled($val) {
        $this->enabled = $val;
    }

    public function get($name) {
        $file = JPATH_SITE.'/cache/filterext/'.$name;
        if (!file_exists($file) || !$this->enabled) {
            return null;
        }
        if ((time() - filemtime($file)) > $this->max_time) {
            return null;
        }
        //print 'cache-'.$name."<br>";
        $data = file_get_contents($file);
        $item = unserialize($data);
        return $item;
    }

    public function set($name, $item) {
        if (!$this->enabled) {
            return false;
        }
        $data = serialize($item);
        return file_put_contents(JPATH_SITE.'/cache/filterext/'.$name, $data);
    }

    public function clear() {
        $dir = JPATH_SITE.'/cache/filterext/';
        $handle = opendir($dir);
        while(false !== ($file = readdir($handle))) {            
            if (is_file($dir.$file) && $file != 'index.html') {
                unlink($dir.$file);
            }
        }
        closedir($handle);
    }

}