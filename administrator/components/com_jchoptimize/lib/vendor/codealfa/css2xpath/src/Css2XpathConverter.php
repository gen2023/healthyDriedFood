<?php

namespace CodeAlfa\Css2Xpath;

class Css2XpathConverter
{
    private array $cache = [];

    private SelectorFactoryInterface $selectorFactory;

    public function __construct(SelectorFactoryInterface $selectorFactory)
    {
        $this->selectorFactory = $selectorFactory;
    }

    public function convert($css): string
    {
        return $this->cache[$css] ??= $this->selectorFactory->createCssSelectorList(
            $this->selectorFactory,
            $css
        )->render();
    }
}
