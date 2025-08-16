<?php

namespace CodeAlfa\Css2Xpath\Selector;

class IdSelector extends AbstractSelector
{
    protected string $name;

    public function __construct(string $name)
    {
        $this->name = $this->cssStripSlash($name);
    }

    public function render(): string
    {
        $delim = $this->getDelimiter($this->getName());

        return "[@id={$delim}{$this->getName()}{$delim}]";
    }

    public function getName(): string
    {
        return $this->name;
    }
}
