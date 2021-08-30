import { RankedTester } from "@jsonforms/core";

import * as cells from "./cells";
import * as complex from "./complex";
import * as controls from "./controls";
import * as layouts from "./layouts";

export interface WithClassname {
    className?: string;
}

export interface WithChildren {
    children: any;
}

export * from "./controls";
export * from "./complex";
export * from "./cells";
export * from "./layouts";
export * from "./util";

export const RNRenderers: { tester: RankedTester; renderer: any }[] = [
    { tester: controls.inputControlTester, renderer: controls.InputControl },
    {
        tester: controls.radioGroupControlTester,
        renderer: controls.RadioGroupControl,
    },
    {
        tester: controls.conditionalControlTester,
        renderer: controls.ConditionalControl,
    },
    { tester: layouts.groupTester, renderer: layouts.GroupLayout },
    { tester: layouts.verticalLayoutTester, renderer: layouts.VerticalLayout },
    {
        tester: layouts.horizontalLayoutTester,
        renderer: layouts.HorizontalLayout,
    },

    { tester: complex.labelRendererTester, renderer: complex.LabelRenderer },
    { tester: complex.categorizationTester, renderer: complex.Categorization },
];

export const RNCells: Array<{ tester: RankedTester; cell: any }> = [
    { tester: cells.booleanCellTester, cell: cells.BooleanCell },
    { tester: cells.dateCellTester, cell: cells.DateCell },
    { tester: cells.dateTimeCellTester, cell: cells.DateTimeCell },
    { tester: cells.enumCellTester, cell: cells.EnumCell },
    { tester: cells.multiEnumCellTester, cell: cells.MultiEnumCell },
    { tester: cells.integerCellTester, cell: cells.IntegerCell },
    { tester: cells.numberCellTester, cell: cells.NumberCell },
    { tester: cells.textAreaCellTester, cell: cells.TextAreaCell },
    { tester: cells.textCellTester, cell: cells.TextCell },
    { tester: cells.timeCellTester, cell: cells.TimeCell },
];
