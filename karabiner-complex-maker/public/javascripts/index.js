const createToKeyInput = () => {
    const $input = $('<input>');
    $input.addClass('to-key');
    $input.addClass('key-field');
    $input.addClass('form-control');
    $input.addClass('col-sm-10');
    $input.prop('readonly', true);
    addInputEvent($input);
    return $input;
};

const createAddToKeyButton = $self => {
    const $addButton = $('<button>');
    if ($self.hasClass('add-to-key-alone')) {
        $addButton.addClass('add-to-key-alone');
    } else {
        $addButton.addClass('add-to-key');
    }
    $addButton.addClass('btn');
    $addButton.addClass('btn-primary');
    $addButton.addClass('col-sm-1');
    $addButton.text('Add');
    $addButton.on('click', function () {
        addToKey($(this));
    });
    return $addButton;
};

const createRemoveButton = () => {
    const $removeButton = $('<buton>');
    $removeButton.addClass('remove-key');
    $removeButton.addClass('btn');
    $removeButton.addClass('btn-danger');
    $removeButton.addClass('col-sm-1');
    $removeButton.text('Remove');
    $removeButton.on('click', function () {
        removeKey($(this));
    });
    return $removeButton;
};

const createClearButton = () => {
    const $clearButton = $('<button>');
    $clearButton.addClass('clear-key');
    $clearButton.addClass('btn');
    $clearButton.addClass('btn-light');
    $clearButton.addClass('col-sm-1');
    $clearButton.text('Clear');
    $clearButton.on('click', function () {
        clearKey($(this));
    });
    return $clearButton;
};

const removeKey = ($self) => {
    const $parent = $self.parent();
    const $toKeysOwner = $parent.parent();
    $parent.remove();
    const other = $toKeysOwner.find('.form-inline');
    if (other.length == 1) {
        other.find('.remove-key').remove();
        other.append(createClearButton());
    }
};

const clearKey = $self => {
    $self.parent().find('.key-field').each((i, elem) => {
        elem.value = '';
    });
};

const addToKey = ($self) => {
    const $parent = $self.parent();
    const $clearKey = $parent.find('.clear-key');
    if ($clearKey[0]) {
        $clearKey.remove();
        $parent.append(createRemoveButton());
    }
    const $row = $('<div>');
    $row.addClass('form-inline');
    $row.append(createToKeyInput());
    $row.append(createAddToKeyButton($self));
    $row.append(createRemoveButton());
    $parent.after($row);
};

const codeMap = new Map([
    ['ArrowLeft', 'left_arrow'],
    ['ArrowRight', 'right_arrow'],
    ['ArrowUp', 'up_arrow'],
    ['ArrowDown', 'down_arrow'],
    ['MetaLeft', 'left_command'],
    ['MetaRight', 'right_command'],
    ['ControlLeft', 'left_control'],
    ['AltLeft', 'left_option'],
    ['CapsLock', 'caps_lock'],
    ['ShiftLeft', 'left_shift'],
    ['ShiftRight', 'right_shift'],
]);

const toKarabinerCode = (k) => {
    const code = codeMap.get(k);
    if (code) return code;
    if (/Key[A-Z]/.test(k)) {
        return /Key([A-Z])/.exec(k)[1].toLowerCase();
    } else if (/Digit[0-9]/.test(k)) {
        return /Digit([0-9])/.exec(k)[1];
    }
    return k;
};

const keySet = new Set();

const drawKeys = ($input) => {
    let keys = '';
    keySet.forEach(k => {
        keys += k + ' ';
    });
    $input.val(keys);
};

const keyDown = (e, $input) => {
    keySet.add(toKarabinerCode(e.originalEvent.code));
    drawKeys($input);
};

const keyUp = (e) => {
    keySet.delete(toKarabinerCode(e.originalEvent.code));
};

const addInputEvent = ($input) => {
    $input.on('keydown', e => {
        keyDown(e, $input);
    });
    $input.on('keyup', e => {
        keyUp(e);
    });
    $input.on('blur', () => {
        keySet.clear();
    })
};

const toKeysOneline = ($elems) => {
    let toKeys = '';
    $elems.each((i, elem) => {
        toKeys += ' -> ' + elem.value;
    });
    return toKeys.slice(' -> '.length);
};

const createModifySettingButton = () => {
    const btn = $('button');
    btn.addClass('modify-setting-btn');
    btn.addClass('btn');
    btn.addClass('btn-primary');
    btn.text('Modify');
    return btn;
};

const createRemoveSettingButton = () => {
    const btn = $('button');
    btn.addClass('remove-setting-btn');
    btn.addClass('btn');
    btn.addClass('btn-danger');
    btn.text('Remove');
    return btn;
};

const addManipulatorsRow = (description, from, optional, to, alone) => {
    const $th = $('<th>');
    const $td1 = $('<td>');
    const $td2 = $('<td>');
    const $td3 = $('<td>');
    const $td4 = $('<td>');
    const $td5 = $('<td>');
    const $td6 = $('<td>');
    $th.prop('scope', 'row');
    $th.text(description);
    $td1.text(from);
    $td2.text(optional);
    $td3.text(to);
    $td4.text(alone);
    const $tr = $('<tr>');
    $tr.append($th);
    $tr.append($td1);
    $tr.append($td2);
    $tr.append($td3);
    $tr.append($td4);
    $tr.append($td5);
    $tr.append($td6);
    $('#manipulators').append($tr);
};

const addSettingRow = () => {
    addManipulatorsRow(
        $('#description').val(),
        $('#inputKey').val(),
        'any',
        toKeysOneline($('.to-key')),
        toKeysOneline($('.to-key-alone'))
    );
};

const doneAdd = () => {
    addSettingRow();
    $.colorbox.close();
    writeResult();
};

const cancelAdd = () => {
    $.colorbox.close();
};

const writeResult = () => {
    const rowsData = [];
    const rows = $('#manipulators').find(('tr'));
    rows.each((i, row) => {
        const rowData = {};
        rowData.description = $(row).find('th').text();
        const $cols = $(row).find('td');
        rowData.from = $cols[0].textContent;
        rowData.optional = $cols[1].textContent;
        rowData.to = $cols[2].textContent;
        rowData.alone = $cols[3].textContent;
        rowsData.push(rowData);
    });
    const rowGroups = {};
    rowsData.forEach(rowData => {
        const manipulator = {};
        manipulator.type = 'basic';
        manipulator.from = {};
        manipulator.from.key_code = '';
        manipulator.from.modifiers = {};
        let count = 0;
        rowData.from.split(' ').reverse().forEach(k => {
            if (!k) return;
            ++count;
            if (count === 1) {
                return manipulator.from.key_code = k;
            }
            if (count === 2) {
                manipulator.from.modifiers.mandatory = [];
            }
            manipulator.from.modifiers.mandatory.push(k);
        });
        if (rowData.optional) {
            manipulator.from.modifiers.optional = [rowData.optional];
        }
        rowData.to.split(' -> ').forEach(to => {
            if (!to) return;
            let count = 0;
            const toData = {};
            to.split(' ').reverse().forEach(k => {
                if (!k) return;
                ++count;
                if (count === 1) {
                    return toData.key_code = k;
                }
                if (!toData.modifiers) {
                    toData.modifiers = [];
                }
                toData.modifiers.push(k);
            });
            if (!manipulator.to) {
                manipulator.to = [];
            }
            manipulator.to.push(toData);
        });
        rowData.alone.split(' -> ').forEach(alone => {
            if (!alone) return;
            let count = 0;
            const aloneData = {};
            alone.split(' ').reverse().forEach(k => {
                if (!k) return;
                ++count;
                if (count === 1) {
                    return aloneData.key_code = k;
                }
                if (!aloneData.modifiers) {
                    aloneData.modifiers = [];
                }
                aloneData.modifiers.push(k);
            });
            if (!manipulator.to_if_alone) {
                manipulator.to_if_alone = [];
            }
            manipulator.to_if_alone.push(aloneData);
        });
        if (!rowGroups[rowData.description]) {
            rowGroups[rowData.description] = {};
            rowGroups[rowData.description].manipulators = [];
        }
        rowGroups[rowData.description].manipulators.push(manipulator);
    });
    const result = {};
    result.title = $('#title').val();
    result.rules = [];
    for (let description in rowGroups) {
        if (rowGroups.hasOwnProperty(description)) {
            const rule = {};
            rule.description = description;
            rule.manipulators = rowGroups[description].manipulators;
            result.rules.push(rule);
        }
    }
    $('#result').val(JSON.stringify(result, undefined, 4));
};

const readExistingFile = (e) => {
    const removeSpacePattern = /¥s?(.*)¥s?/;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener('load', () => {
        const loadedData = JSON.parse(reader.result);
        $('#title').val(loadedData.title);
        loadedData.rules.forEach(rule => {
            const description = rule.description;
            rule.manipulators.forEach(manipulator => {
                const from = manipulator.from;
                const modifiers = from.modifiers;
                let fromStr = '';
                if (modifiers) {
                    const mandatory = modifiers.mandatory;
                    if (mandatory) {
                        mandatory.forEach(k => {
                            fromStr += k + ' ';
                        });
                    }
                    fromStr += from.key_code;
                }
                const optional = modifiers.optional;
                let optStr = '';
                if (optional) {
                    optional.forEach(op => {
                        optStr += op + ' ';
                    });
                    if (optStr) {
                        optStr = optStr.replace(removeSpacePattern, '$1');
                    }
                }
                let toStr = '';
                if (manipulator.to) {
                    manipulator.to.forEach(to => {
                        if (to.modifiers) {
                            to.modifiers.forEach(mod => {
                                toStr += mod + ' ';
                            });
                            toStr += to.key_code;
                        }
                        toStr += ' -> ';
                    });
                    toStr = toStr.slice(0, toStr.length - ' -> '.length);
                }
                let aloneStr = '';
                if (manipulator.to_if_alone) {
                    manipulator.to_if_alone.forEach(alone => {
                        if (alone.modifiers) {
                            alone.modifiers.forEach(mod => {
                                aloneStr += mod + ' ';
                            });
                            aloneStr += alone.key_code;
                        }
                        aloneStr += ' -> ';
                    });
                    aloneStr = aloneStr.slice(0, ' -> '.length);
                }
                addManipulatorsRow(description, fromStr, optStr, toStr, aloneStr);
            });
        });
        $('#result').val(JSON.stringify(loadedData, undefined, 4));
    });
};

$(() => {
    $('#addManipulator').colorbox({
        width: '90%',
        height: '90%',
        inline: true,
        overlayClose: false,
        escKey: false
    });
    $('.add-to-key').on('click', function () {
        addToKey($(this));
    });
    $('.add-to-key-alone').on('click', function () {
        addToKey($(this));
    });
    $('.remove-key').on('click', function () {
        removeKey($(this));
    });
    $('.clear-key').on('click', function () {
        clearKey($(this));
    });
    addInputEvent($('#inputKey'));
    addInputEvent($('.to-key'));
    addInputEvent($('.to-key-alone'));
    $('#doneAdd').on('click', () => {
        doneAdd();
    });
    $('#cancelAdd').on('click', () => {
        cancelAdd();
    });
    $('#getResult').on('click', () => {
        writeResult();
    });
    $('#fileRead').on('change', e => {
        readExistingFile(e);
    })
});
