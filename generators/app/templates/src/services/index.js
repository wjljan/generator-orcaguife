// localStorage operations
export {lsGet, lsSet, lsRemove, lsClearAll} from './localStorage';

// cookie operations
export {ckGet, ckSet, ckRemove, getSystemStatusInCookie} from './cookie';

// reference mapping
export {timeUnitMilliSecondMap, capacityUnitSizeMap, enMonthMap, enWeekMap, cnNumberMap} from './localData';

// format digit to Byte, KByte, MByte, GByte, TByte, PByte, EByte, ZByte .etc
export {formatStorageSize, formatNetworkSize} from './format/bytesToSize';

// format digit to time, date
export {formatTimeLeft, formatTime} from './format/time';

// format random number
export {randomNumberBoth} from './format/random';

// calculate capacity bar color
export {getCapacityColour} from './format/capacityColour';

// case
export {someUpperCase} from './format/toUpperCase';

// validation
export {validateHostname, validateIpv4, validateIpv4Segment, validateFsName, validatePathname, validatePassword, validateNotZeroInteger, validatePathRelevance, validateIEOrEdgeBrowser} from './validation';

// decorator
export {validationUpdateState, throttle, debounce, createScrollbar, destroyScrollbar, catchAPIError, dispatchAction} from './decorator';

// download
export {downloadFile} from './download';